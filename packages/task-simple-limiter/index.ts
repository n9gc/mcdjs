/**
 * 任务限流器
 * @module task-simple-limiter
 * @version 2.2.0
 * @license GPL-2.0-or-later
 */
declare module '.';

export interface Releaser {
	(): void;
}
interface Waiter {
	(id: number): void;
}
const optionKeys: (keyof LimiterOption)[] = [];
const Option = (_: any, key: keyof LimiterOption) => void optionKeys.push(key);
export interface LimiterOption {
	/**
	 * 最大并发数量，默认为无限制
	 * @default 0
	 */
	concurrency?: number;
}
export default class Limiter {
	constructor(limiter: Limiter);
	constructor(limiterOption?: LimiterOption);
	constructor(n: Limiter | LimiterOption = {}) {
		if ('hold' in n) return n;
		optionKeys.forEach(key => key in n && ((<any>this[key]) = n[key]));
		this.checkIdle();
	}
	@Option concurrency = 0;
	protected concurrencyNow = 0;
	protected readonly waiters: Waiter[] = [];
	protected idleIds: number[] = [];
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
