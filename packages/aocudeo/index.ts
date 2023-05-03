/**
 * 胡乱加载链表类定义模块
 * @module aocudeo
 * @version 2.1.1
 * @license GPL-3.0-or-later
 */
declare module '.';

type AnyArr<T = any> = readonly T[];
type MayArr<T> = AnyArr<T> | T;
type Vcb = () => void;
type Id = string | symbol | number;
export interface PosInfo {
	after?: AnyArr<Id> | Id;
	before?: AnyArr<Id> | Id;
}
const EXIST = Symbol();
export function noMulti(arr: Id | AnyArr<Id> = [], rslt: Id[] = []) {
	const map: { [x: Id]: symbol; } = {};
	rslt.forEach(n => map[n] = EXIST);
	(typeof arr === 'object'
		? arr
		: [arr]
	).forEach(n => map[n] === EXIST
		|| (map[n] = EXIST, rslt.push(n))
	);
	return rslt;
}
export default class ChainList {
	static START = Symbol('Load start');
	static END = Symbol('Load end');
	constructor() {
		this.countMap[ChainList.START] = 1;
	}
	private actMap: { [id: Id]: Vcb[]; } = Object.create(null);
	private postListMap: { [id: Id]: Id[]; } = Object.create(null);
	private countMap: { [id: Id]: number; } = Object.create(null);
	protected getList(id: Id) {
		return this.postListMap[id] || (this.postListMap[id] = []);
	}
	protected plusCount(id: Id, num = 1) {
		this.countMap[id] = (this.countMap[id] || 0) + num;
	}
	addAct(id: Id, act: MayArr<Vcb>) {
		(this.actMap[id] || (this.actMap[id] = []))
			.push(...(typeof act === 'function' ? [act] : act));
		return this;
	}
	insert(id: Id, pos: PosInfo, act: MayArr<Vcb> | null = null) {
		act && this.addAct(id, act);
		const afters = noMulti(pos.after, [ChainList.START]);
		this.plusCount(id, afters.length);
		afters.forEach(n => this.getList(n).push(id));
		const befores = noMulti(pos.before, [ChainList.END]);
		befores.forEach(n => this.plusCount(n));
		this.getList(id).push(...befores);
		return this;
	}
	load = (id: Id = ChainList.START) => {
		if (--this.countMap[id]) return;
		this.actMap[id]?.forEach(fn => fn());
		this.postListMap[id]?.forEach(this.load);
	};
}
