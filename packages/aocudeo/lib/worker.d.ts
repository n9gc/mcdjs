/**
 * 回调相关
 * @module aocudeo/lib/worker
 * @version 3.1.3
 * @license GPL-2.0-or-later
 */
declare module './worker';
import type Limiter from 'task-simple-limiter';
import type { Id, MapLike, MayArray } from './types';
import { ArrayMap, ReadonlyArrayMap } from './util';
export interface WorkerFunction<T> {
    (context: WorkerContext<T>): void;
}
export interface WorkerAsyncFunction<T> {
    (context: WorkerContext<T>): void | PromiseLike<unknown>;
}
export type Worker<T, F extends WorkerAsyncFunction<T>> = {
    run: F;
} | MayArray<F>;
export type Workers<T, F extends WorkerAsyncFunction<T> = WorkerAsyncFunction<T>> = MapLike<Worker<T, F>>;
/**模块的动作回调 */
export declare class WorkerContext<T> {
    readonly id: Id;
    readonly maker: WorkerRunner<T, any>;
    constructor(id: Id, maker: WorkerRunner<T, any>);
    get data(): T;
    set data(n: T);
}
export declare class WorkerRunner<T, F extends WorkerAsyncFunction<T>> {
    protected readonly workerMap: ReadonlyArrayMap<Id, F>;
    data: T;
    constructor(workerMap: ReadonlyArrayMap<Id, F>, data: T);
    protected doFnSync(id: Id): void;
    runSync(id: Id): void;
    protected doFnAsync(id: Id): Promise<unknown[]>;
    runAsync(id: Id, limiter: Limiter): Promise<void>;
}
export declare class WorkerManager<T, F extends WorkerAsyncFunction<T>> {
    protected readonly workerMap: ArrayMap<Id, F>;
    add(id: Id, worker: Worker<T, F>): void;
    getRunner(data: T): WorkerRunner<T, F>;
}
