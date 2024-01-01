/**
 * 执行器
 * @module aocudeo/lib/executor
 * @version 1.6.1
 * @license GPL-2.0-or-later
 */
declare module './executor';

import type Limiter from 'task-simple-limiter';
import { CircleChecker, SignChecker } from './checker';
import { Organizer } from './organizer';
import type { SurePosition } from './position';
import type { Hookable, Id, MapObj } from './types';
import type { WorkerRunner } from './worker';

export class Graph {
	readonly edgeMap: MapObj<Id[]> = Object.create(null);
	readonly indegreeMap: MapObj<number> = Object.create(null);
	private putInList(id: Id, ids: Id[]) {
		(this.edgeMap[id] || (this.edgeMap[id] = [])).push(...ids);
	}
	private plusCount(id: Id, num = 1) {
		this.indegreeMap[id] = (this.indegreeMap[id] || 0) + num;
	}
	private insertAfter(id: Id, after: Id[]) {
		after.forEach(n => this.putInList(n, [id]));
		this.plusCount(id, after.length);
	}
	private insertBefore(id: Id, before: Id[]) {
		this.putInList(id, before);
		before.forEach(n => this.plusCount(n));
	}
	private insert(id: Id, after: Id[], before: Id[]) {
		this.insertAfter(id, after);
		this.insertBefore(id, before);
	}
	private getEdgeOf(id: Id, direction: 'Pre' | 'Main' | 'Post'): Id {
		if (typeof id !== 'symbol' && this.splitedChecker.isEnsured(id)) return this.getEdgeOf(Organizer[`affix${direction}`] + id, direction);
		return id;
	}
	private insertEdge(id: Id, after: Id[], before: Id[]) {
		this.insertAfter(this.getEdgeOf(id, 'Pre'), after.map(id => this.getEdgeOf(id, 'Post')));
		this.insertBefore(this.getEdgeOf(id, 'Post'), before.map(id => this.getEdgeOf(id, 'Pre')));
	}
	private linkSymbol(id: Id) {
		switch (Organizer.getHookedPartOf(id)) {
			case 'All': return this.insert(id, [Organizer.start], [Organizer.end]);
			case 'Post': return this.insert(id, [], [Organizer.end]);
			case 'Pre': return this.insert(id, [Organizer.start], []);
		}
	}
	constructor(
		surePositionMap: Map<Id, SurePosition>,
		private splitedChecker: SignChecker<Hookable>,
	) {
		surePositionMap.forEach(({ after, before }, id) => this.insertEdge(id, [...after], [...before]));
		[...surePositionMap.keys()].filter(id => id !== Organizer.end && id !== Organizer.start).forEach(id => this.linkSymbol(id));
		splitedChecker.getEnsureds().forEach(id => this.insertEdge(Organizer.affixMain + id, [Organizer.affixPre + id], [Organizer.affixPost + id]));
		this.indegreeMap[Organizer.start] = 1;
	}
	protected readonly circleChecker = new CircleChecker(this.edgeMap);
	tryThrow() {
		this.circleChecker.tryThrow();
	}
	getExecutor<T>(workRunner: WorkerRunner<T, any>) {
		return new Executor(this.edgeMap, this.indegreeMap, workRunner);
	}
}
export class Executor<T> {
	constructor(
		protected readonly edgeMap: MapObj<readonly Id[]>,
		indegreeMap: MapObj<number>,
		protected readonly workRunner: WorkerRunner<T, any>,
	) {
		this.indegreeMap = Object.create(indegreeMap);
	}
	protected readonly indegreeMap: MapObj<number>;
	// protected judge(hookPosition: 'pre' | 'post', id: Id, n: T) {
	// 	return this.positionObjMap[id]?.[`${hookPosition}Judger`]?.(n) === false;
	// }
	private executeSyncSub(id: Id) {
		if (--this.indegreeMap[id]!) return;
		// if (this.judge('pre', id, n)) return n;
		this.workRunner.runSync(id);
		// if (this.judge('post', id, n)) return n;
		this.edgeMap[id]!.forEach(id => this.executeSyncSub(id));
	}
	executeSync() {
		this.executeSyncSub(Organizer.start);
		// this.workRunner.tryThrow();
		return this.workRunner.data;
	}
	private limiter: Limiter | null = null;
	private async executeAsyncSub(id: Id) {
		if (--this.indegreeMap[id]!) return;
		// if (this.judge('pre', id, n)) return n;
		await this.workRunner.runAsync(id, this.limiter!);
		// if (this.judge('post', id, n)) return n;
		await Promise.all(this.edgeMap[id]!.map(id => this.executeAsyncSub(id)));
	}
	async executeAsync(limiter: Limiter) {
		this.limiter = limiter;
		await this.executeAsyncSub(Organizer.start);
		// this.workRunner.tryThrow();
		return this.workRunner.data;
	}
}
