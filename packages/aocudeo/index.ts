/**
 * 胡乱加载链表类定义模块
 * @module aocudeo
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
declare module '.';

type Shifted<T extends readonly any[]> = T extends readonly [any, ...infer T] ? T : T;
type Vcb = () => void;
type ArgAll = [rev: boolean, pos: string, name: string, action: Vcb];
type Arg = Shifted<ArgAll>;

export enum ErrorType {
	UseBeforeDefine,
	CannotBeSeted,
}

type ErrorHandler = (errorType: ErrorType, trakcer: Error, info: string) => never;
let throwError: ErrorHandler = (errorType, tracker, info) => {
	throw { errorType, info, tracker };
};
export function setErrorHandler(handler: ErrorHandler) {
	throwError = handler;
}

export default class ChainList {
	private list = new Map([['pole', 'pole']]);
	private listRev = new Map([['pole', 'pole']]);
	private actions = new Map<string, Vcb>;
	private waiting = new Map<string, ArgAll[]>;
	protected insertAllType(...args: ArgAll[]): this {
		if (!args.length) return this;
		const [[rev, pos, name, action], ...argsNext] = args;
		this.actions.set(name, action);
		const [l0, l1] = rev ? [this.listRev, this.list] : [this.list, this.listRev];
		const n = l0.get(pos);
		if (!n) {
			let argList: ArgAll[];
			this.waiting.has(pos)
				? argList = this.waiting.get(pos)!
				: this.waiting.set(pos, argList = []);
			argList.push(args[0]);
			return this;
		}
		l0.set(pos, name);
		l0.set(name, n);
		l1.set(n, name);
		l1.set(name, pos);
		return this.insertAllType(...argsNext, ...(this.waiting.get(name) ?? []));
	}
	insertAfter(...args: Arg) {
		return this.insertAllType([false, ...args]);
	}
	insertBefore(...args: Arg) {
		return this.insertAllType([true, ...args]);
	}
	load() {
		let now = this.list.get('pole');
		while (now && now !== 'pole') {
			this.actions.get(now)?.();
			this.actions.delete(now);
			now = this.list.get(now);
		}
	}
}
