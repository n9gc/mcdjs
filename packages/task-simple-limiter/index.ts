/**
 * 任务限流器
 * @module task-simple-limiter
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module '.';

export interface LimiterOption {
	concurrency?: number;
}
export default class Limiter {
	constructor(limiter: Limiter);
	constructor(limiterOption?: LimiterOption);
	constructor(n: Limiter | LimiterOption = {}) {
		if ('hold' in n) return n;
		Object.assign(this, n);
	}
	concurrency = 0;
	protected resolvers: (() => void)[] = [];
	protected running = 0;
	hold(): Promise<number> | number {
		return this.concurrency && this.running >= this.concurrency
			? new Promise(res => this.resolvers.push(() => res(++this.running)))
			: ++this.running;
	}
	release() {
		this.running && (this.running--, this.resolvers.shift()?.());
	}
}
