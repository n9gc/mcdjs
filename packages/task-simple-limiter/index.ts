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
const optionKeys: (keyof LimiterOption)[] = [];
const Option = (_: any, key: keyof LimiterOption) => void optionKeys.push(key);
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
	constructor(n: Limiter | LimiterOption = {}) {
		if ('hold' in n) return n;
		optionKeys.forEach(key => key in n && ((<any>this[key]) = n[key]));
		this.checkIdle();
	}
	/**是否在并发数改变后立刻尝试运行空闲任务 */
	@Option autoCheckIdle = true;
	/**最大并发数量 */
	@Option
	set concurrency(n) {
		n < 0 && (n = Infinity);
		this._concurrency = n;
		if (this.autoCheckIdle) this.checkIdle();
	}
	get concurrency() { return this._concurrency; }
	protected _concurrency = Infinity;
	running = 0;
	protected readonly waiters: Vcb[] = [];
	/**检查并运行空闲的任务 */
	checkIdle() {
		while (this.waiters.length && this.running < this._concurrency) {
			this.waiters.shift()!();
			++this.running;
		}
	}
	/**阻塞代码并获得释放器 */
	hold() {
		return new Promise<Releaser>(res => {
			let ender: Vcb | null = () => {
				--this.running;
				this.checkIdle();
				ender = null;
			};
			const execute = () => res(() => ender?.());
			this.waiters.push(execute);
			this.checkIdle();
		});
	}
	async run<T>(fn: () => PromiseLike<T> | T) {
		const release = await this.hold();
		try {
			return await fn();
		}
		finally {
			release();
		}
	}
}
