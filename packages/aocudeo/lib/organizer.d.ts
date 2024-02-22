/**
 * 组织器类
 * @module aocudeo/lib/organizer
 * @version 1.5.2
 * @license GPL-2.0-or-later
 */
declare module './organizer';
import Limiter, { LimiterOption } from 'task-simple-limiter';
import { Position, PositionMap, Positions } from './position';
import type { Hookable, Id } from './types';
import { Worker, WorkerAsyncFunction, WorkerFunction, WorkerManager, Workers } from './worker';
export declare class AffixsToolKit {
    static readonly hookTypes: readonly ["Pre", "Main", "Post"];
    private static _affixPre;
    static get affixPre(): string;
    static set affixPre(n: string);
    private static _affixMain;
    static get affixMain(): string;
    static set affixMain(n: string);
    private static _affixPost;
    static get affixPost(): string;
    static set affixPost(n: string);
    protected static setAffix(type: 'Pre' | 'Main' | 'Post', n: string): void;
    static affixs: readonly [string, string, string];
    static getAffixedOf(id: Hookable): {
        preId: string;
        mainId: string;
        postId: string;
    };
    /**@deprecated 请使用 {@link AffixsToolKit.getAffixedOf|`AffixsToolKit.getAffixedOf`} 代替此方法 */
    static getAffixed(id: Hookable): {
        preId: string;
        mainId: string;
        postId: string;
    };
    protected static getAffixs(): readonly [string, string, string];
    protected static getHookTypeMap(): {
        readonly [x: string]: "Post" | "Pre" | "Main";
    };
    private static hookTypeMap;
    static getHookTypeOf(id: Id | false): false | "Post" | "Pre" | "Main";
    /**@deprecated 请使用 {@link AffixsToolKit.getHookTypeOf|`AffixsToolKit.getHookTypeOf`} 代替此方法 */
    static getHookType(id: Id): false | "Post" | "Pre" | "Main";
    static getHookedOf(id: Id | false): string | false;
    private static ensureHookedPart;
    static getHookedPartOf(id: Id): "All" | "Body" | "Post" | "Pre";
}
export interface OrganizerConfig<T = unknown, F extends WorkerAsyncFunction<T> = WorkerAsyncFunction<T>> {
    /**
     * 是否可以重用
     * @default true
     */
    reusable?: boolean;
    /**
     * 各个模块的动作回调
     * @default {}
     */
    workers?: Workers<T, F>;
    /**
     * 各个模块的位置信息
     * @default {}
     */
    positions?: Positions;
}
export declare abstract class Organizer<T, F extends WorkerAsyncFunction<T>> extends AffixsToolKit {
    static readonly start: unique symbol;
    static readonly end: unique symbol;
    static readonly unknown: unique symbol;
    constructor({ workers, positions, reusable }?: OrganizerConfig<T, F>);
    /**是否可以重用 */
    reusable: boolean;
    /**是否已经加载完一次了 */
    loaded: boolean;
    protected readonly positionMap: PositionMap;
    /**
     * 插入模块
     * @param id 模块标识符
     * @param position 位置信息
     * @param worker 动作回调
     */
    addPosition(id: Id, position?: Position, worker?: Worker<T, F> | null): this;
    /**
     * 插入多个模块
     * @param positions 各个模块的位置信息
     */
    addPositions(positions: Positions): this;
    protected readonly workerManager: WorkerManager<T, F>;
    /**
     * 增加动作回调
     * @param id 要增加的模块
     * @param worker 动作回调
     * @param noInsert 若模块不存在，是否不要主动插入
     */
    addWorker(id: Id, worker: Worker<T, F>, noInsert?: boolean): this;
    /**
     * 增加多个模块的动作回调
     * @param workers 各个模块的动作回调
     * @param noInsert 是否不要主动插入 {@link workers} 中未被插入的模块
     */
    addWorkers(workers: Workers<T, F>, noInsert?: boolean): this;
    tryThrow(): void;
    protected getExecutor(data: T): import("./executor").Executor<T>;
    /**
     * 加载！
     * @param data 初始运行参数
     */
    execute(data?: T): T | Promise<T> | boolean;
    getDiagram(): import("./diagram").Diagram;
}
export interface OrganizerAsyncConfig<T = unknown> extends OrganizerConfig<T> {
    /**
     * 最大同时任务数量
     * @see {@link Queue.concurrency|`Queue#concurrency`}
     * @default 0
     */
    concurrency?: number;
}
/**异步模块加载器 */
export declare class OrganizerAsync<T = void> extends Organizer<T, WorkerAsyncFunction<T>> {
    constructor({ concurrency, ...organizerConfig }?: OrganizerAsyncConfig<T>);
    /**最大同时任务数量 */
    concurrency: number;
    execute(data: T, limiterOption?: Limiter | LimiterOption): T | Promise<T>;
}
/**模块加载器 */
export declare class OrganizerSync<T = void> extends Organizer<T, WorkerFunction<T>> {
    execute(data: T): T;
}
