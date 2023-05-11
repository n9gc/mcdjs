/**
 * 胡乱加载器
 * @module aocudeo
 * @version 2.7.5
 * @license GPL-3.0-or-later
 */
declare module '.';

type AnyArr<T = any> = readonly T[];
type MayArr<T> = AnyArr<T> | T;
type Cb<T> = (n: T) => T;
type ACb<T> = (n: T) => PromiseLike<T>;
type EqualTo<A, B> = (<F>() => F extends A ? 1 : 0) extends (<F>() => F extends B ? 1 : 0) ? true : false;
namespace Ts {
	export type Hokab = string | number;
	export type Id = symbol | Hokab;
	export interface PosInfo {
		after?: MayArr<Id>;
		before?: MayArr<Id>;
		preOf?: MayArr<Hokab>;
		postOf?: MayArr<Hokab>;
	}
	export namespace PosInfo {
		export const keys = [
			'after',
			'before',
			'preOf',
			'postOf',
		] as const;
	}
	export type MapObj<T, K extends Id = Id> = { [I in K]: T };
	export enum ErrorType {
		InsertBeforeStart,
		InsertAfterEnd,
		CircularReference,
		UnregistedCodeUnits,
	}
	export interface AocudeoError {
		type: keyof typeof ErrorType;
		tracker: Error;
	}
	export class AocudeoError {
		constructor(type: ErrorType, tracker: Error, infos?: any) {
			this.type = ErrorType[type] as any;
			Object.assign(this, infos);
			this.tracker = tracker;
		}
	}
}
import Id = Ts.Id;
import MapObj = Ts.MapObj;
import PosInfo = Ts.PosInfo;
import ErrorType = Ts.ErrorType;
function isSym(n: any): n is symbol {
	return typeof n === 'symbol';
}
function getArr<T>(mayArr?: MayArr<T>) {
	return typeof mayArr === 'undefined' ? [] : mayArr instanceof Array ? mayArr : [mayArr];
}
abstract class Loader<T, F extends Cb<T> | ACb<T>> {
	static throwError(type: ErrorType, tracker: Error, infos?: any): never {
		throw new Ts.AocudeoError(type, tracker, infos);
	}
	protected static EXIST = Symbol('exist');
	protected static EXISTING = Symbol('existing');
	protected static noMulti<T extends Id>(arr: MayArr<T> = [], rslt: T[] = [], chkType?: 0 | 1) {
		const map: MapObj<symbol> = {};
		rslt.forEach(n => map[n] = this.EXIST);
		getArr(arr).forEach(n => map[n] === this.EXIST || (map[n] = this.EXIST, rslt.push(n)));
		typeof chkType === 'number'
			&& map[chkType ? this.END : this.START] === this.EXIST
			&& this.throwError(chkType, Error(`不能在 ${chkType ? 'START 前' : 'END 后'}插入东西`));
		return rslt;
	}
	static START = Symbol('load start');
	static END = Symbol('load end');
	static HOOK_NAME: [pre: string, post: string] = ['pre:', 'post:'];
	constructor(
		n?: T,
	) {
		this.n = n!;
		this.countMap[Loader.START] = 1;
		this.countMap[Loader.END] = 1;
		this.postListMap[Loader.START] = [Loader.END];
		this.postListMap[Loader.END] = [];
	}
	reuse = false;
	protected n: T;
	loaded = false;
	protected actMap: MapObj<F[]> = Object.create(null);
	protected postListMap: MapObj<Id[]> = Object.create(null);
	private countMap: MapObj<number> = Object.create(null);
	protected getCount(): MapObj<number> {
		return Object.create(this.countMap);
	}
	protected tidy(odName: 'after' | 'before', pos: PosInfo) {
		const order = odName === 'after' ? 1 : 0;
		const odSign = Loader.HOOK_NAME[order];
		const odUnsign = Loader.HOOK_NAME[Number(!order)];
		let preOf = Loader.noMulti(pos.preOf);
		let postOf = Loader.noMulti(pos.postOf);
		order ? preOf = preOf.map(n => odUnsign + n) : postOf = postOf.map(n => odUnsign + n);
		return [
			order ? Loader.START : Loader.END,
			...preOf,
			...Loader.noMulti(pos[odName], [], order).map(n => isSym(n) ? n : odSign + n),
			...postOf,
		];
	}
	private putInList(id: Id, lazy: boolean, ...ids: Id[]) {
		(this.postListMap[id] || (this.postListMap[id] = []))[lazy ? 'push' : 'unshift'](...ids);
	}
	private plusCount(id: Id, num = 1) {
		this.countMap[id] = (this.countMap[id] || 0) + num;
	}
	protected regAfter(id: Id, afters: Id[], lazy = false) {
		this.plusCount(id, afters.length);
		afters.forEach(n => this.putInList(n, lazy, id));
	}
	protected regBefore(id: Id, befores: Id[], lazy = false) {
		befores.forEach(n => this.plusCount(n));
		this.putInList(id, lazy, ...befores);
	}
	addAct(id: Id, act: MayArr<F>) {
		(this.actMap[id] || (this.actMap[id] = [])).push(...getArr(act));
		return this;
	}
	insert(id: Id, pos: PosInfo = {}, act: MayArr<F> | null = null) {
		this.regSign(true, id);
		this.regSign(false, pos);
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
	private idSign: MapObj<symbol> = {};
	protected regSign(method: true, id: Id): void;
	protected regSign(method: false, n: PosInfo | Id): void;
	protected regSign(...args: [true, Id] | [false, PosInfo | Id]): void {
		if (args[0]) {
			this.idSign[args[1]] = Loader.EXIST;
			return;
		}
		const n = args[1];
		if (typeof n !== 'object') this.idSign[n] === Loader.EXIST || (this.idSign[n] = Loader.EXISTING);
		else PosInfo.keys.forEach(key => getArr(n[key]).forEach(id => this.regSign(false, id)));
	}
	checkLost() {
		const list = Reflect.ownKeys(this.idSign).filter(id => this.idSign[id] === Loader.EXISTING);
		if (list.length) Loader.throwError(3, Error('出现了未注册的模块'), { list });
	}
	protected checkCircleSub(id: Id, statMap: MapObj<symbol>, circle: Id[]) {
		if (statMap[id] === Loader.EXIST) return false;
		if (statMap[id] === Loader.EXISTING) return circle.splice(0, circle.indexOf(id)), true;
		statMap[id] = Loader.EXISTING, circle.push(id);
		let p: Id;
		for (p of this.postListMap[id] || []) if (this.checkCircleSub(p, statMap, circle)) return true;
		statMap[id] = Loader.EXIST, circle.pop();
		return false;
	}
	checkCircle(id: Id = Loader.START, statMap: MapObj<symbol> = {}) {
		const circle: Id[] = [];
		if (this.checkCircleSub(id, statMap, circle)) Loader.throwError(2, Error('出现环形引用'), { circle });
	}
	protected walkAt(id: Id, countMap: MapObj<number>, path: Id[]) {
		if (--countMap[id]) return;
		path.push(id);
		this.postListMap[id]?.forEach(id => this.walkAt(id, countMap, path));
	}
	walk() {
		if (this.loaded) return [];
		this.checkLost();
		this.checkCircle();
		const countMap = this.getCount();
		const path: Id[] = [];
		this.walkAt(Loader.START, countMap, path);
		return path;
	}
	abstract load(): EqualTo<F, Cb<T>> extends true ? T : Promise<T>;
}
namespace Loader {
	export import Types = Ts;
}
export class LoaderAsync<T = void> extends Loader<T, Cb<T> | ACb<T>> {
	protected async loadSub(id: Id, countMap: MapObj<number>) {
		if (--countMap[id]) return this.n;
		if (id in this.actMap) {
			let waiter = new Promise<T>(res => res(this.n));
			this.actMap[id].forEach(fn => waiter = waiter.then(fn));
			this.n = await waiter;
		}
		id in this.postListMap && await Promise.all(
			this.postListMap[id].map(id => this.loadSub(id, countMap))
		);
		return this.n;
	}
	override load() {
		if (!this.reuse && this.loaded) return Promise.resolve(this.n);
		this.checkLost();
		this.checkCircle();
		this.loaded = true;
		return this.loadSub(Loader.START, this.getCount());
	}
}
export namespace LoaderAsync {
	export import Types = Ts;
}
export class LoaderSync<T = void> extends Loader<T, Cb<T>> {
	override load() {
		if (!this.reuse && this.loaded) return this.n;
		const path = this.walk();
		this.loaded = true;
		path.forEach(id => this.actMap[id]?.forEach(fn => this.n = fn(this.n)));
		return this.n;
	}
}
export namespace LoaderSync {
	export import Types = Ts;
}
export default LoaderSync;
