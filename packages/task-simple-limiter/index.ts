/**
 * 任务限流器
 * @module task-simple-limiter
 * @version 3.1.0
 * @license GPL-2.0-or-later
 */
declare module '.';

/**释放器 */
export interface Releaser {
	(): void;
}
interface Waiter {
	(id: number): void;
}
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
		if (this.concurrencyNow > n) {
			this.concurrencyNow = n;
			this.idleIds = this.idleIds.filter(id => id <= this.concurrencyNow);
		}
		if (this.autoCheckIdle) this.checkIdle();
	}
	get concurrency() { return this._concurrency; }
	_concurrency = Infinity;
	protected concurrencyNow = 0;
	protected readonly waiters: Waiter[] = [];
	protected idleIds: number[] = [];
	/**检查并运行空闲的任务 */
	checkIdle() {
		while (this.idleIds.length || this.concurrencyNow < this._concurrency) {
			const next = this.waiters.shift();
			if (!next) return;
			next(this.idleIds.pop() || ++this.concurrencyNow);
		}
	}
	/**阻塞代码并获得释放器 */
	hold() {
		return new Promise<Releaser>(res => {
			const execute = (id: number) => res(() => {
				if (id <= this._concurrency) this.idleIds.push(id);
				this.checkIdle();
			});
			this.waiters.push(execute);
			this.checkIdle();
		});
	}
}
