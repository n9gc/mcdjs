/**
 * 任务限流器
 * @module task-simple-limiter
 * @version 3.3.0
 * @license GPL-2.0-or-later
 */
declare module '.';
/**释放器 */
export interface Releaser {
    (): void;
}
type Vcb = () => void;
/**限流器配置 */
export interface LimiterOption {
    /**
     * 最大并发数量，范围 0 ~ Infinity
     *
     * 若赋为负数则相当于 Infinity
     * @default Infinity
     */
    concurrency?: number;
    /**
     * 是否在并发数改变后立刻尝试运行空闲任务
     * @default true
     */
    autoCheckIdle?: boolean;
}
/**任务限流器 */
export default class Limiter {
    /**返回给入的限流器 */
    constructor(limiter: Limiter);
    /**创建新的限流器 */
    constructor(limiterOption?: LimiterOption);
    /**是否在并发数改变后立刻尝试运行空闲任务 */
    autoCheckIdle: boolean;
    /**最大并发数量 */
    set concurrency(n: number);
    get concurrency(): number;
    protected _concurrency: number;
    running: number;
    protected readonly waiters: Vcb[];
    /**检查并运行空闲的任务 */
    checkIdle(): void;
    /**阻塞代码并获得释放器 */
    hold(): Promise<Releaser>;
    run<T>(fn: () => PromiseLike<T> | T): Promise<T>;
}
export {};
