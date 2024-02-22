/**
 * 执行器
 * @module aocudeo/lib/executor
 * @version 1.6.1
 * @license GPL-2.0-or-later
 */
declare module './executor';
import type Limiter from 'task-simple-limiter';
import { SignChecker } from './checker';
import type { SurePosition } from './position';
import type { Hookable, Id, MapObj } from './types';
import type { WorkerRunner } from './worker';
export declare class Graph {
    private splitedChecker;
    readonly edgeMap: MapObj<Id[]>;
    readonly indegreeMap: MapObj<number>;
    private putInList;
    private plusCount;
    private insertAfter;
    private insertBefore;
    private insert;
    private getEdgeOf;
    private insertEdge;
    private linkSymbol;
    constructor(surePositionMap: Map<Id, SurePosition>, splitedChecker: SignChecker<Hookable>);
    tryThrow: () => void;
    getExecutor<T>(workRunner: WorkerRunner<T, any>): Executor<T>;
}
export declare class Executor<T> {
    protected readonly edgeMap: MapObj<readonly Id[]>;
    protected readonly workRunner: WorkerRunner<T, any>;
    constructor(edgeMap: MapObj<readonly Id[]>, indegreeMap: MapObj<number>, workRunner: WorkerRunner<T, any>);
    protected readonly indegreeMap: MapObj<number>;
    private executeSyncSub;
    executeSync(): T;
    private limiter;
    private executeAsyncSub;
    executeAsync(limiter: Limiter): Promise<T>;
}
