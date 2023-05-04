/**
 * 胡乱加载链表类定义模块
 * @module aocudeo
 * @version 2.3.1
 * @license GPL-3.0-or-later
 */
declare module '.';

type AnyArr<T = any> = readonly T[];
type MayArr<T> = AnyArr<T> | T;
type Cb<T> = (n: T) => T;
type Id = string | symbol | number;
namespace Loader {
	export interface PosInfo {
		after?: MayArr<Id>;
		before?: MayArr<Id>;
	}
}
class Loader<T = void> {
	static EXIST = Symbol('exist');
	static noMulti(arr: MayArr<Id> = [], rslt: Id[] = []) {
		const map: { [x: Id]: symbol; } = {};
		rslt.forEach(n => map[n] = this.EXIST);
		(typeof arr === 'object' ? arr : [arr])
			.forEach(n => map[n] === this.EXIST
				|| (map[n] = this.EXIST, rslt.push(n))
			);
		return rslt;
	}
	static START = Symbol('load start');
	static END = Symbol('load end');
	constructor(n?: T) {
		this.n = n!;
		this.countMap[Loader.START] = 1;
	}
	private n: T;
	private actMap: { [id: Id]: Cb<T>[]; } = Object.create(null);
	private postListMap: { [id: Id]: Id[]; } = Object.create(null);
	private countMap: { [id: Id]: number; } = Object.create(null);
	protected getList(id: Id) {
		return this.postListMap[id] || (this.postListMap[id] = []);
	}
	protected plusCount(id: Id, num = 1) {
		this.countMap[id] = (this.countMap[id] || 0) + num;
	}
	protected regAfter(id: Id, pos: Loader.PosInfo) {
		const afters = Loader.noMulti(pos.after, [Loader.START]);
		this.plusCount(id, afters.length);
		afters.forEach(n => this.getList(n).push(id));
	}
	protected regBefore(id: Id, pos: Loader.PosInfo) {
		const befores = Loader.noMulti(pos.before, [Loader.END]);
		befores.forEach(n => this.plusCount(n));
		this.getList(id).push(...befores);
	}
	addAct(id: Id, act: MayArr<Cb<T>>) {
		(this.actMap[id] || (this.actMap[id] = []))
			.push(...(typeof act === 'function' ? [act] : act));
		return this;
	}
	insert(id: Id, pos: Loader.PosInfo = {}, act: MayArr<Cb<T>> | null = null) {
		act && this.addAct(id, act);
		if (typeof id === 'symbol') {
			this.regAfter(id, pos);
			this.regBefore(id, pos);
		} else {
			const preId = `pre:${id}`;
			const postId = `post:${id}`;
			this.regAfter(preId, pos);
			this.regAfter(id, { after: preId });
			this.regBefore(id, { before: postId });
			this.regBefore(postId, pos);
		}
		return this;
	}
	protected loadImp(id: Id) {
		if (--this.countMap[id]) return;
		this.actMap[id]?.forEach(fn => this.n = fn(this.n));
		this.postListMap[id]?.forEach(this.load);
	}
	load = (id: Id = Loader.START) => this.loadImp(id);
}
export default Loader;
