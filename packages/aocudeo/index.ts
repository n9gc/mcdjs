/**
 * 胡乱加载链表类定义模块
 * @module aocudeo
 * @version 2.5.0
 * @license GPL-3.0-or-later
 */
declare module '.';

type AnyArr<T = any> = readonly T[];
type MayArr<T> = AnyArr<T> | T;
type Cb<T> = (n: T) => T;
type Hokab = string | number;
type Id = symbol | Hokab;
import MapObj = Loader.MapObj;
import PosInfo = Loader.PosInfo;
function isSym(n: any): n is symbol {
	return typeof n === 'symbol';
}
function getArr<T>(mayArr: MayArr<T>) {
	return mayArr instanceof Array ? mayArr : [mayArr];
}
class Loader<T = void> {
	protected static EXIST = Symbol('exist');
	protected static noMulti<T extends Id>(arr: MayArr<T> = [], rslt: T[] = []) {
		const map: MapObj<symbol> = {};
		rslt.forEach(n => map[n] = this.EXIST);
		getArr(arr).forEach(n => map[n] === this.EXIST
			|| (map[n] = this.EXIST, rslt.push(n)));
		return rslt;
	}
	static START = Symbol('load start');
	static END = Symbol('load end');
	static HOOK_NAME: [pre: string, post: string] = ['pre:', 'post:'];
	constructor(n?: T) {
		this.n = n!;
		this.countMap[Loader.START] = 1;
	}
	private n: T;
	private actMap: MapObj<Cb<T>[]> = Object.create(null);
	private postListMap: MapObj<Id[]> = Object.create(null);
	private countMap: MapObj<number> = Object.create(null);
	protected getList(id: Id) {
		return this.postListMap[id] || (this.postListMap[id] = []);
	}
	protected plusCount(id: Id, num = 1) {
		this.countMap[id] = (this.countMap[id] || 0) + num;
	}
	protected tidy(odName: 'after' | 'before', pos: PosInfo) {
		const order = odName === 'after';
		const odSign = Loader.HOOK_NAME[Number(order)];
		const odUnsign = Loader.HOOK_NAME[Number(!order)];
		const aous = (n: Hokab) => odUnsign + n;
		let preOf = Loader.noMulti(pos.preOf);
		let postOf = Loader.noMulti(pos.postOf);
		order ? preOf = preOf.map(aous) : postOf = postOf.map(aous);
		return [
			order ? Loader.START : Loader.END,
			...preOf,
			...Loader.noMulti(pos[odName]).map(n => isSym(n) ? n : odSign + n),
			...postOf,
		];
	}
	protected regAfter(id: Id, afters: Id[], lazy = false) {
		this.plusCount(id, afters.length);
		afters.forEach(n => this.getList(n)[lazy ? 'push' : 'unshift'](id));
	}
	protected regBefore(id: Id, befores: Id[], lazy = false) {
		befores.forEach(n => this.plusCount(n));
		this.getList(id)[lazy ? 'push' : 'unshift'](...befores);
	}
	addAct(id: Id, act: MayArr<Cb<T>>) {
		(this.actMap[id] || (this.actMap[id] = [])).push(...getArr(act));
		return this;
	}
	insert(id: Id, pos: PosInfo = {}, act: MayArr<Cb<T>> | null = null) {
		act && this.addAct(id, act);
		if (isSym(id)) {
			this.regAfter(id, this.tidy('after', pos));
			this.regBefore(id, this.tidy('before', pos));
		} else {
			const preId = Loader.HOOK_NAME[0] + id;
			const postId = Loader.HOOK_NAME[1] + id;
			this.regAfter(preId, this.tidy('after', pos));
			this.regAfter(id, [preId], true);
			this.regBefore(id, [postId], true);
			this.regBefore(postId, this.tidy('before', pos));
		}
		return this;
	}
	protected walkAt(id: Id, countMap: MapObj<number>, path: Id[]) {
		if (--countMap[id]) return;
		path.push(id);
		this.postListMap[id]?.forEach(id => this.walkAt(id, countMap, path));
	}
	walk() {
		const countMap = Object.create(this.countMap);
		const path: Id[] = [];
		this.walkAt(Loader.START, countMap, path);
		return path;
	}
	protected loadImp(id: Id) {
		if (--this.countMap[id]) return;
		this.actMap[id]?.forEach(fn => this.n = fn(this.n));
		this.postListMap[id]?.forEach(this.load);
	}
	load = (id: Id = Loader.START) => this.loadImp(id);
}
namespace Loader {
	export interface PosInfo {
		after?: MayArr<Id>;
		before?: MayArr<Id>;
		preOf?: MayArr<Hokab>;
		postOf?: MayArr<Hokab>;
	}
	export type MapObj<T, K extends Id = Id> = { [I in K]: T };
}
export default Loader;
