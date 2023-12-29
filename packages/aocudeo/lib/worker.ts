/**
 * 回调相关
 * @module aocudeo/lib/worker
 * @version 3.1.0
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
export class WorkerRunner<T, F extends WorkerAsyncFunction<T>> {
	constructor(
		protected readonly workerMap: ReadonlyArrayMap<Id, F>,
		public data: T,
	) { }
	protected doFnSync(id: Id) {
		this.workerMap.get(id)?.forEach(fn => fn(new WorkerContext(id, this)));
	}
	runSync(id: Id): void {
		this.doFnSync(id);
		if (Organizer.getHookTypeOf(id) === 'Main') return this.runSync(Organizer.getHookedOf(id) as string);
	}
	protected doFnAsync(id: Id) {
		return Promise.all(this.workerMap.get(id)?.map(fn => fn(new WorkerContext(id, this)))!);
	}
	async runAsync(id: Id, limiter: Limiter): Promise<void> {
		if (this.workerMap.has(id)) {
			const release = await limiter.wait();
			await this.doFnAsync(id);
			release();
		}
		if (Organizer.getHookTypeOf(id) === 'Main') return this.runAsync(Organizer.getHookedOf(id) as string, limiter);
	}
}
export class Limiter {
	constructor(
		public concurrency: number,
		public timeout: number,
	) {
		this.queue.concurrency = concurrency;
		this.queue.timeout = timeout;
	}
	protected queue = new Queue({ autostart: true });
	wait() {
		return new Promise<() => void>(grab => this.queue.push(() => new Promise<void>(res => grab(res))));
	}
}
export function getLimiter(concurrency: number) {
	return new Queue({ autostart: true, concurrency });
}
export class WorkerManager<T, F extends WorkerAsyncFunction<T>> {
	protected readonly workerMap = new ArrayMap<Id, F>();
	add(id: Id, worker: Worker<T, F>) {
		if ('run' in worker) worker = worker.run;
		if (!(worker instanceof Array)) worker = [worker];
		if (!worker.length) return;
		this.workerMap.push(id, ...worker);
	}
	getRunner(data: T) {
		return new WorkerRunner(this.workerMap, data);
	}
}
