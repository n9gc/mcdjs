/**
 * 胡乱加载链表类定义模块
 * @module aocudeo
 * @version 2.0.0
 * @license GPL-3.0-or-later
 */
declare module '.';

type AnyArr<T = any> = readonly T[];
type Shifted<T extends AnyArr> = T extends readonly [any, ...infer T] ? T : T;
type Vcb = () => void;
type ArgAll = [rev: boolean, pos: string, name: string, action: Vcb];
type Arg = Shifted<ArgAll>;
type Id = string | symbol;
interface PosInfo {
	after?: AnyArr<Id> | Id;
}
interface DepInfo {
	count: number;
	id: Id;
}
const EXIST = Symbol();
function noMulti(arr: Id | AnyArr<Id> = [], rslt: Id[] = []) {
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
	static START = Symbol();
	private actMap: { [id: Id]: Vcb; } = Object.create(null);
	private postListMap: { [id: Id]: DepInfo[]; } = Object.create(null);
	private infoStart: DepInfo = { id: ChainList.START, count: 1 };
	insert(pos: PosInfo, id: Id, act: Vcb) {
		this.actMap[id] = act;
		const afters = noMulti(pos.after, [ChainList.START]);
		const depInfo: DepInfo = { id, count: afters.length };
		afters.forEach(n => (this.postListMap[n] || (this.postListMap[n] = [])).push(depInfo));
	}
	load = (depInfo = this.infoStart) => {
		if (--depInfo.count) return;
		const { id } = depInfo;
		this.actMap[id]?.();
		this.postListMap[id]?.forEach(this.load);
	}
}
