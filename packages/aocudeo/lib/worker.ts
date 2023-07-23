/**
 * 回调相关
 * @module aocudeo/lib/worker
 * @version 2.0.3
 * @license GPL-2.0-or-later
 */
declare module './worker';

import Queue from 'queue';
import { Organizer } from './organizer';
import type { Id, MapLike, MayArray } from './types';
import { ArrayMap, ReadonlyArrayMap } from './util';

export interface WorkerFunction<T> {
	(context: WorkerContext<T>): void;
}
export interface WorkerAsyncFunction<T> {
	(context: WorkerContext<T>): void | PromiseLike<unknown>;
}
export type Worker<T, F extends WorkerAsyncFunction<T>> = { run: F; } | MayArray<F>;
export type Workers<T, F extends WorkerAsyncFunction<T> = WorkerAsyncFunction<T>> = MapLike<Worker<T, F>>;
/**模块的动作回调 */
export class WorkerContext<T> {
	constructor(
		public readonly id: Id,
		public readonly maker: WorkerRunner<T, any>,
	) { }
	get data() {
		return this.maker.data;
	}
	set data(n: T) {
		this.maker.data = n;
	}
}
export abstract class WorkerRunner<T, F extends WorkerAsyncFunction<T>> {
	constructor(
		protected readonly workerMap: ReadonlyArrayMap<Id, F>,
		public data: T,
	) { }
	protected makeContext(id: Id): WorkerContext<T> {
		return new WorkerContext(id, this);
	}
	abstract run(id: Id): void | PromiseLike<void>;
}
export class WorkerRunnerSync<T> extends WorkerRunner<T, WorkerFunction<T>> {
	override run(id: Id): void {
		this.workerMap.get(id)?.forEach(fn => fn(this.makeContext(id)));
		if (Organizer.getHookType(id) === 'Main') return this.run(Organizer.getHookedOf(id) as string);
	}
}
export class WorkerRunnerAsync<T> extends WorkerRunner<T, WorkerAsyncFunction<T>> {
	constructor(
		workerMap: ReadonlyArrayMap<Id, WorkerAsyncFunction<T>>,
		data: T,
		protected limiter: Queue,
	) { super(workerMap, data); }
	override async run(id: Id): Promise<void> {
		if (this.workerMap.has(id)) {
			const release = await new Promise<() => void>(grab => this.limiter.push(() => new Promise<void>(res => grab(res))));
			await Promise.all(this.workerMap.get(id)?.map(fn => fn(this.makeContext(id)))!);
			release();
		}
		if (Organizer.getHookType(id) === 'Main') return this.run(Organizer.getHookedOf(id) as string);
	}
}
export abstract class WorkerManager<T, F extends WorkerAsyncFunction<T>> {
	protected readonly workerMap = new ArrayMap<Id, F>();
	add(id: Id, worker: Worker<T, F>) {
		if ('run' in worker) worker = worker.run;
		if (!(worker instanceof Array)) worker = [worker];
		if (!worker.length) return;
		this.workerMap.push(id, ...worker);
	}
	abstract getRunner(data: T, concurrency?: number): WorkerRunner<T, F>;
}
export class WorkerManagerSync<T> extends WorkerManager<T, WorkerFunction<T>> {
	override getRunner(data: T): WorkerRunnerSync<T> {
		return new WorkerRunnerSync(this.workerMap, data);
	}
}
export class WorkerManagerAsync<T> extends WorkerManager<T, WorkerAsyncFunction<T>> {
	override getRunner(data: T, concurrency: number): WorkerRunnerAsync<T> {
		return new WorkerRunnerAsync(this.workerMap, data, new Queue({ autostart: true, concurrency }));
	}
}
