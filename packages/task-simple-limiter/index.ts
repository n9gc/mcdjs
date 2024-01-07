/**
 * 任务限流器
 * @module task-simple-limiter
 * @version 2.0.0
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
		let i = 0;
		while (i++ < this.concurrency) this.idleIds.push(i);
	}
	@Option readonly concurrency = 0;
	protected readonly waiters: Waiter[] = [];
	protected readonly idleIds: number[] = [];
	hold() {
		return new Promise<Releaser>(res => {
			const execute = (id: number) => res(() => {
				const next = this.waiters.shift();
				next ? next(id) : this.idleIds.push(id);
			});
			const id = this.idleIds.pop();
			id ? execute(id) : this.waiters.push(execute);
		});
	}
}
