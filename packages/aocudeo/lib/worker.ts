/**
 * 回调相关
 * @module aocudeo/lib/worker
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './worker';

import Queue from 'queue';
import { MapLike, MayArray, Id } from './types';
import { ArrayMap, ReadonlyArrayMap } from './util';

export interface WorkerFunction<T> {
	(context: WorkerContext<T>): void;
}
export interface WorkerAsyncFunction<T> {
	(context: WorkerContext<T>): void | PromiseLike<void>;
}
export type Worker<T, F extends WorkerAsyncFunction<T>> = { run: F; } | MayArray<F>;
export type WorkerMap<T, F extends WorkerAsyncFunction<T> = WorkerAsyncFunction<T>> = MapLike<Worker<T, F>>;
/**模块的动作回调 */
export class WorkerContext<T> {
	constructor(
		public readonly id: Id,
		public readonly maker: WorkerContextMaker<T>,
	) { }
	get data() {
		return this.maker.data;
	}
	set data(n: T) {
		this.maker.data = n;
	}
}
export class WorkerContextMaker<T> {
	constructor(
		public data: T,
	) { }
	make(id: Id): WorkerContext<T> {
		return new WorkerContext(id, this);
	}
}
abstract class WorkerRunner<T, F extends WorkerAsyncFunction<T>> {
	constructor(
		protected readonly workerMap: ReadonlyArrayMap<Id, F>,
		data: T,
	) {
		this.contextMaker = new WorkerContextMaker(data);
	}
	protected readonly contextMaker: WorkerContextMaker<T>;
	abstract run(id: Id): void | PromiseLike<void>;
}
export class WorkerRunnerSync<T> extends WorkerRunner<T, WorkerFunction<T>> {
	override run(id: Id) {
		this.workerMap.get(id)?.forEach(fn => fn(this.contextMaker.make(id)));
	}
}
export class WorkerRunnerAsync<T> extends WorkerRunner<T, WorkerAsyncFunction<T>> {
	constructor(
		protected limiter: Queue,
		...superArgs: ConstructorParameters<typeof WorkerRunner<T, WorkerAsyncFunction<T>>>
	) { super(...superArgs); }
	override async run(id: Id) {
		if (!this.workerMap.has(id)) return;
		const release = await new Promise<() => void>(grab => this.limiter.push(() => new Promise<void>(res => grab(res))));
		await Promise.all(this.workerMap.get(id)?.map(fn => fn(this.contextMaker.make(id)))!);
		release();
	}
}
abstract class WorkerManager<T, F extends WorkerAsyncFunction<T>> {
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
		return new WorkerRunnerAsync(new Queue({ autostart: true, concurrency }), this.workerMap, data);
	}
}
