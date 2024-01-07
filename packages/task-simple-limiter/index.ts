/**
 * 任务限流器
 * @module task-simple-limiter
 * @version 2.2.2
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
	 * 最大并发数量，默认为无限制
	 * @default 0
	 */
	concurrency?: number;
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
	/**
	 * 最大并发数量
	 *
	 * 调用 {@link checkIdle|`Limiter#checkIdle`} 可在增加最大并发数后立刻运行更多任务
	 */
	@Option concurrency = 0;
	protected concurrencyNow = 0;
	protected readonly waiters: Waiter[] = [];
	protected idleIds: number[] = [];
	/**检查并运行空闲的任务 */
	checkIdle() {
		if (this.concurrencyNow > this.concurrency && this.concurrency) {
			this.concurrencyNow = this.concurrency;
			this.idleIds = this.idleIds.filter(id => id <= this.concurrencyNow);
		}
		while (this.idleIds.length || this.concurrencyNow < this.concurrency || !this.concurrency) {
			const next = this.waiters.shift();
			if (!next) return;
			next(this.idleIds.pop() || ++this.concurrencyNow);
		}
	}
	/**阻塞代码并获得释放器 */
	hold() {
		return new Promise<Releaser>(res => {
			const execute = (id: number) => res(() => {
				if (id <= this.concurrency || !this.concurrency) this.idleIds.push(id);
				this.checkIdle();
			});
			this.waiters.push(execute);
			this.checkIdle();
		});
	}
}
