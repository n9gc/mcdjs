/**
 * 图
 * @module aocudeo/lib/graph
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './graph';

import { Id, Hookable, MapObj } from './types';
import { Organizer } from './organizer';
import { SignChecker, CircleChecker } from './checker';
import { SurePosition } from './position';

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
	constructor(
		surePositionMap: Map<Id, SurePosition>,
		private splitedChecker: SignChecker<Hookable>,
	) {
		surePositionMap.forEach(({ after, before }, id) => this.insertEdge(id, [...after], [...before]));
		[...surePositionMap.keys()].filter(id => id !== Organizer.end && Organizer.start).forEach(id => this.insert(id, [Organizer.start], [Organizer.end]));
		splitedChecker.getEnsureds().forEach(id => this.insertEdge(Organizer.affixMain + id, [Organizer.affixPre + id], [Organizer.affixPost + id]));
	}
	private safeResult: readonly Id[] | false | null = null;
	isSafe() {
		return this.safeResult === null
			? this.safeResult = new CircleChecker(this.edgeMap).result
			: this.safeResult;
	}
}
