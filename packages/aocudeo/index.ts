/**
 * 胡乱加载器
 * @module aocudeo
 * @version 3.4.1
 * @license GPL-2.0-or-later
 */
declare module '.';

import Queue from "queue";

type AnyArr<T = any> = readonly T[];
type MayArr<T> = AnyArr<T> | T;
type Cb<T> = (n: T) => T | void;
type ACb<T> = (n: T) => PromiseLike<T | void>;
type Judger<T> = (n: T) => boolean;
type EqualTo<A, B> = (<F>() => F extends A ? 1 : 0) extends (<F>() => F extends B ? 1 : 0) ? true : false;
type InitMap<T> = Map<Id, T> | MapObj<T>;
export type Hokab = string | number;
export type Id = symbol | Hokab;
interface JudgerObj<T> {
	preJudger?: Judger<T>;
	postJudger?: Judger<T>;
}
interface PosInfoObj<T> extends JudgerObj<T> {
	after?: MayArr<Id>;
	before?: MayArr<Id>;
	preOf?: MayArr<Hokab>;
	postOf?: MayArr<Hokab>;
}
namespace PosInfoObj {
	export const keys = [
		'after',
		'before',
		'preOf',
		'postOf',
	] as const;
}
/**@see {@link PosInfoObj.after|`PosInfoObj#after`} */
type PosInfoArr = AnyArr<Id>;
export type PosInfo<T = unknown> = PosInfoObj<T> | PosInfoArr | Id;
type MapObj<T, K extends Id = Id> = { [I in K]: T };
type Act<T, F extends Cb<T> | ACb<T>> = { run: F; } | MayArr<F>;
export type Acts<T, F extends Cb<T> | ACb<T>> = InitMap<Act<T, F>>;
export type PosMap<T = unknown> = InitMap<PosInfo<T>> | MayArr<AnyArr<Id>>;
export enum ErrorType {
	InsertBeforeStart,
	InsertAfterEnd,
	CircularReference,
	UnregistedCodeUnits,
}
export class AocudeoError {
	constructor(
		type: ErrorType,
		tracker: Error,
		infos?: any,
	) {
		this.type = ErrorType[type] as keyof typeof ErrorType;
		Object.assign(this, infos);
		this.tracker = tracker;
	}
	readonly type;
	declare readonly tracker;
}
function isSym(n: any): n is symbol {
	return typeof n === 'symbol';
}
function getArr<T>(mayArr?: MayArr<T>) {
	return typeof mayArr === 'undefined' ? [] : mayArr instanceof Array ? mayArr : [mayArr];
}
function throwError(type: ErrorType, tracker: Error, infos?: any): never {
	throw new AocudeoError(type, tracker, infos);
}
function mapMap<N>(map: { [id: Id]: N; } | Map<Id, N>, cb: (value: N, id: Id) => void) {
	map instanceof Map
		? map.forEach(cb)
		: Reflect.ownKeys(map).forEach(id => cb(map[id], id));
}
abstract class Loader<T, F extends Cb<T> | ACb<T>> {
	protected static readonly EXIST = Symbol('exist');
	protected static readonly EXISTING = Symbol('existing');
	static readonly START = Symbol('load start');
	static readonly END = Symbol('load end');
	static HOOK_NAME: [pre: string, post: string] = ['pre:', 'post:'];
	constructor(...args:
		| [reuse?: boolean]
		| [acts: Acts<T, F>, reuse?: boolean]
		| [acts: Acts<T, F>, posMap: PosMap<T>, reuse?: boolean]
	) {
		if (typeof args[0] !== 'object') args = [{}, ...args];
		if (typeof args[1] !== 'object') args = [args[0], {}, args[1]];
		const [acts, posMap, reuse = false] = args;
		this.reuse = reuse;
		this.countMap[Loader.START] = 1;
		this.countMap[Loader.END] = 1;
		this.addAct(acts);
		this.insert(posMap);
	}
	reuse: boolean;
	loaded = false;
	protected readonly actMap: MapObj<F[]> = Object.create(null);
	protected readonly postListMap: MapObj<Id[]> = Object.create(null);
	protected readonly posObjMap: MapObj<PosInfoObj<T>> = Object.create(null);
	private readonly countMap: MapObj<number> = Object.create(null);
	protected getCount(): MapObj<number> {
		return Object.create(this.countMap);
	}
	private tidyHook(pos: PosInfoObj<T>, kn: 'preOf' | 'postOf', order: boolean) {
		const odUnsign = Loader.HOOK_NAME[order ? 0 : 1];
		return order === (kn === 'postOf')
			? getArr(pos[kn])
			: getArr(pos[kn]).map(n => odUnsign + n);
	}
	private tidyMain(arr: AnyArr<Id>, order: boolean) {
		if (arr.includes(order ? Loader.END : Loader.START)) throwError(Number(order), Error(`不能在 ${order ? 'END 后' : 'START 前'}插入东西`));
		const odSign = Loader.HOOK_NAME[order ? 1 : 0];
		return arr.map(n => isSym(n) ? n : odSign + n);
	}
	protected tidy(odName: 'after' | 'before', pos: PosInfoObj<T>) {
		const order = odName === 'after';
		return [
			...(order ? [Loader.START] : []),
			...this.tidyHook(pos, 'preOf', order),
			...this.tidyMain(getArr(pos[odName]), order),
			...this.tidyHook(pos, 'postOf', order),
		];
	}
	private putInList(id: Id, lazy: boolean, ids: MayArr<Id>) {
		(this.postListMap[id] || (this.postListMap[id] = []))[lazy ? 'push' : 'unshift'](...getArr(ids));
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
		this.putInList(id, lazy, befores);
	}
	addAct(actMap: Acts<T, F>, noInsert?: boolean): this;
	addAct(id: Id, act: Act<T, F>, noInsert?: boolean): this;
	addAct(id: Id | Acts<T, F>, act?: Act<T, F> | boolean, noInsert: boolean = false) {
		if (typeof id === 'object') {
			mapMap(id, (acti, id) => this.addAct(id, acti, typeof act === 'boolean' ? act : void 0));
			return this;
		}
		switch (typeof act) { case 'boolean': case 'undefined': return this; }
		if (!noInsert && this.idSign[id] !== Loader.EXIST) this.insert(id);
		if ('run' in act) act = act.run;
		(this.actMap[id] || (this.actMap[id] = [])).push(...getArr(act));
		return this;
	}
	insert(posMap: PosMap<T>): this;
	insert(id: Id, pos?: PosInfo<T>, act?: Act<T, F> | null): this;
	insert(id: Id | PosMap<T>, pos: PosInfo<T> = {}, act: Act<T, F> | null = null) {
		if (typeof id === 'object') {
			id instanceof Array
				? id.forEach((pl, idx) => 
					typeof pl !== 'object'
						? this.insert(pl, idx ? id[idx - 1] : {})
						: (
							this.insert(pl[0]),
							pl.length < 2 || pl.reduce((p, t) => (this.insert(t, p), t))
						)
				)
				: mapMap(id, (pos, id) => this.insert(id, pos));
			return this;
		}
		if (typeof pos !== 'object') pos = [pos];
		if ('length' in pos) pos = { after: pos };
		this.regSign(true, id);
		this.regSign(false, pos);
		if (act) this.addAct(id, act);
		if (isSym(id)) {
			this.regAfter(id, this.tidy('after', pos));
			this.regBefore(id, this.tidy('before', pos));
			this.posObjMap[id] = pos;
			if (pos.preJudger) this.preJudgerSign[id] = Loader.EXIST;
			if (pos.postJudger) this.postJudgerSign[id] = Loader.EXIST;
		} else {
			const [preId, postId] = Loader.HOOK_NAME.map(n => n + id);
			this.regAfter(preId, this.tidy('after', pos));
			this.regAfter(id, [preId], true);
			this.regBefore(id, [postId], true);
			this.regBefore(postId, this.tidy('before', pos));
			this.posObjMap[preId] = { preJudger: pos.preJudger };
			this.posObjMap[postId] = { postJudger: pos.postJudger };
			if (pos.preJudger) this.preJudgerSign[preId] = Loader.EXIST;
			if (pos.postJudger) this.postJudgerSign[postId] = Loader.EXIST;
		}
		return this;
	}
	private readonly idSign: MapObj<symbol> = {
		[Loader.START]: Loader.EXIST,
		[Loader.END]: Loader.EXIST,
	};
	protected regSign(method: true, id: Id): void;
	protected regSign(method: false, n: PosInfoObj<T> | Id): void;
	protected regSign(...args: [true, Id] | [false, PosInfoObj<T> | Id]): void {
		if (args[0]) return void (this.idSign[args[1]] = Loader.EXIST);
		const n = args[1];
		typeof n !== 'object'
			? this.idSign[n] === Loader.EXIST || (this.idSign[n] = Loader.EXISTING)
			: PosInfoObj.keys.forEach(key => getArr(n[key]).forEach(id => this.regSign(false, id)));
	}
	checkLost() {
		const list = Reflect.ownKeys(this.idSign).filter(id => this.idSign[id] === Loader.EXISTING);
		if (list.length) throwError(3, Error('出现了未注册的模块'), { list });
	}
	private checkCircleSub(id: Id, statMap: MapObj<symbol>, circle: Id[]) {
		if (statMap[id] === Loader.EXIST) return false;
		if (statMap[id] === Loader.EXISTING) {
			circle.splice(0, circle.indexOf(id));
			return true;
		}
		statMap[id] = Loader.EXISTING, circle.push(id);
		for (const p of this.postListMap[id] || []) {
			if (this.checkCircleSub(p, statMap, circle)) return true;
		}
		statMap[id] = Loader.EXIST, circle.pop();
		return false;
	}
	checkCircle(id: Id = Loader.START, statMap: MapObj<symbol> = {}) {
		const circle: Id[] = [];
		if (this.checkCircleSub(id, statMap, circle)) throwError(2, Error('出现环形引用'), { circle });
	}
	private walkAt(id: Id, countMap: MapObj<number>, path: Id[]) {
		if (--countMap[id]) return;
		path.push(id);
		this.postListMap[id]?.forEach(id => this.walkAt(id, countMap, path));
	}
	walk() {
		this.checkLost();
		this.checkCircle();
		const path: Id[] = [];
		this.walkAt(Loader.START, this.getCount(), path);
		return path;
	}
	protected preLoad() {
		if (!this.reuse && this.loaded) return null;
		this.checkLost();
		this.checkCircle();
		this.loaded = true;
		return this.getCount();
	}
	protected judge(pos: 'pre' | 'post', id: Id, n: T) {
		return this.posObjMap[id]?.[`${pos}Judger`]?.(n) === false; 
	}
	abstract load(n?: T): EqualTo<F, Cb<T>> extends true ? T : Promise<T>;
	private readonly preJudgerSign: MapObj<symbol> = {};
	private readonly postJudgerSign: MapObj<symbol> = {};
	private dotLine(a: Id, b: Id, sign?: boolean) {
		return [
			'\t',
			!sign && new Set([a, b, Loader.END, Loader.START]).size < 4 && '// ',
			`"${a.toString()}" -> "${b.toString()}"`,
			this.postJudgerSign[a] === Loader.EXIST || this.preJudgerSign[b] === Loader.EXIST && ' [style = dashed]',
		].filter(n => n).join('');
	}
	showDot(sign?: boolean) {
		return [...new Set([
			'digraph loader {',
			...Reflect.ownKeys(this.idSign)
				.filter(id => this.idSign[id] === Loader.EXIST && id !== Loader.END)
				.map(id => isSym(id) ? id.toString() : Loader.HOOK_NAME[1] + id)
				.map(id => this.dotLine(id, Loader.END, sign)),
			...Reflect.ownKeys(this.postListMap)
				.map(a => this.postListMap[a].map(b => this.dotLine(a, b, sign)))
				.flat(),
			// Object.keys(this.idSign)
			// 	.map(n => [
			// 		`subgraph cluster_${n} {`,
			// 		`\t"${n}";`,
			// 		Loader.HOOK_NAME.map(p => `\t"${p}${n}";`),
			// 		'}',
			// 	])
			// 	.flat(2)
			// 	.map(n => '\t' + n)
			// 	.join('\n'),
			'}',
		])].join('\n');
	}
	show(sign?: boolean) {
		const url = `http://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(this.showDot(sign))}`;
		typeof window === 'undefined' ? console.log(url) : window.open(url);
	}
}
abstract class LoaderAsyncProto<T> extends Loader<T, Cb<T> | ACb<T>> {
	constructor(...args: 
		| [reuse?: boolean]
		| [concurrency: number, reuse?: boolean]
		| [acts: Acts<T, Cb<T> | ACb<T>>, concurrency: number, reuse?: boolean]
		| [acts: Acts<T, Cb<T> | ACb<T>>, posMap?: PosMap<T>, reuse?: boolean]
		| [acts: Acts<T, Cb<T> | ACb<T>>, posMap: PosMap<T>, concurrency: number, reuse?: boolean]
	) {
		if (typeof args[0] !== 'object') args = [{}, {}, ...args];
		if (typeof args[1] === 'number') args = [args[0], {}, args[1], args[2]];
		if (typeof args[2] !== 'number') args = [args[0], args[1] || {}, 0, args[2]];
		const [acts, posMap, concurrency, reuse] = args;
		super(acts, posMap, reuse)
		this.concurrency = concurrency;
	}
	concurrency: number;
	private async loadSub(id: Id, countMap: MapObj<number>, n: T, lmter: Queue): Promise<T> {
		if (--countMap[id]) return n;
		if (this.judge('pre', id, n)) return n;
		if (id in this.actMap) {
			const freer = await new Promise<Cb<void>>(run => lmter.push(() => new Promise(res => run(res))));
			let waiter = new Promise<T>(res => res(n));
			this.actMap[id].forEach(fn => waiter = waiter.then(fn).then(r => r || n));
			n = await waiter;
			freer();
		}
		if (this.judge('post', id, n)) return n;
		if (id in this.postListMap) await Promise.all(this.postListMap[id].map(id => this.loadSub(id, countMap, n, lmter).then(r => n = r)));
		return n;
	}
	override async load(...arg: T extends void ? [] : [n: T]): Promise<T>;
	override async load(n?: T) {
		const countMap = this.preLoad();
		if (!countMap) return n;
		const lmter = new Queue({ concurrency: this.concurrency, autostart: true });
		n = await this.loadSub(Loader.START, countMap, n!, lmter);
		n = await this.loadSub(Loader.END, countMap, n, lmter);
		return n;
	}
}
export class LoaderAsync<T = void> extends LoaderAsyncProto<Awaited<T>> { }
export class LoaderSync<T = void> extends Loader<T, Cb<T>> {
	private loadSub(id: Id, countMap: MapObj<number>, n: T) {
		if (--countMap[id]) return n;
		if (this.judge('pre', id, n)) return n;
		this.actMap[id]?.forEach(fn => n = fn(n) || n);
		if (this.judge('post', id, n)) return n;
		this.postListMap[id]?.forEach(id => n = this.loadSub(id, countMap, n));
		return n;
	}
	override load(...arg: T extends void ? [] : [n: T]): T;
	override load(n?: T) {
		const countMap = this.preLoad();
		if (!countMap) return n;
		n = this.loadSub(Loader.START, countMap, n!);
		n = this.loadSub(Loader.END, countMap, n);
		return n;
	}
}
export default LoaderSync;
