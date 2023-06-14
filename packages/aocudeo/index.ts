/**
 * 胡乱加载器
 * @module aocudeo
 * @version 4.0.0-dev.1
 * @license GPL-2.0-or-later
 */
declare module '.';

import Queue from "queue";

type AnyArray<T = any> = readonly T[];
type MayArray<T> = AnyArray<T> | T;
type Callback<T> = (n: T) => T | void;
type AsyncCallback<T> = (n: T) => void | T | PromiseLike<void | T>;
/**拦截器 */
type Judger<T> = (n: T) => boolean;
type MapLike<T> = Map<Id, T> | MapObj<T>;
/**可挂钩子的标识符类型 */
export type Hookable = string | number;
/**标识符类型 */
export type Id = symbol | Hookable;
/**拦截器对象 */
interface JudgerObj<T> {
	/**运行前的拦截器，若返回 `false` 则停止运行此模块 */
	preJudger?: Judger<T>;
	/**运行后的拦截器，若返回 `false` 则停止运行依赖此模块的模块 */
	postJudger?: Judger<T>;
}
/**位置信息对象 */
interface PositionObj<T> extends JudgerObj<T> {
	/**此模块依赖的模块 */
	after?: MayArray<Id>;
	/**依赖此模块的模块 */
	before?: MayArray<Id>;
	/**挂在哪些模块前面作为钩子 */
	preOf?: MayArray<Hookable>;
	/**挂在哪些模块后面作为钩子 */
	postOf?: MayArray<Hookable>;
}
namespace PositionObj {
	export const keys = [
		'after',
		'before',
		'preOf',
		'postOf',
	] as const;
}
/**{@link PositionObj.after|`PositionObj#after`} 的简写 */
type PositionArray = AnyArray<Id>;
/**位置信息 */
export type Position<T = unknown> = PositionObj<T> | PositionArray | Id;
type MapObj<T, K extends Id = Id> = { [I in K]: T };
/**模块的动作回调 */
type Action<T, F extends AsyncCallback<T>> = { run: F; } | MayArray<F>;
export type Actions<T, F extends AsyncCallback<T> = AsyncCallback<T>> = MapLike<Action<T, F>>;
export type Positions<T = unknown> = MapLike<Position<T>> | MayArray<AnyArray<Id>>;
/**错误类型 */
export enum ErrorType {
	/**在 {@link Loader.START|`Loader.START`} 前插入模块 */
	InsertBeforeStart,
	/**在 {@link Loader.END|`Loader.END`} 后插入模块 */
	InsertAfterEnd,
	/**出现了环形引用 */
	CircularReference,
	/**加载时仍有被引用的模块未被插入 */
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
function isSymbol(n: any): n is symbol {
	return typeof n === 'symbol';
}
function getArray<T>(mayArray?: MayArray<T>) {
	return typeof mayArray === 'undefined' ? [] : mayArray instanceof Array ? mayArray : [mayArray];
}
function throwError(type: ErrorType, tracker: Error, infos?: any): never {
	throw new AocudeoError(type, tracker, infos);
}
/**遍历 {@link map} */
function mapMap<N>(map: { [id: Id]: N; } | Map<Id, N>, walker: (value: N, id: Id) => void) {
	map instanceof Map
		? map.forEach(walker)
		: Reflect.ownKeys(map).forEach(id => walker(map[id], id));
}
export interface LoaderConfig<T = unknown, F extends AsyncCallback<T> = Callback<T>> {
	/**是否可以重用 */
	reusable?: boolean;
	/**各个模块的动作回调 */
	actions?: Actions<T, F>;
	/**各个模块的位置信息 */
	positions?: Positions<T>;
}
abstract class Loader<T, F extends AsyncCallback<T>> {
	protected static readonly EXIST = Symbol('exist');
	protected static readonly EXISTING = Symbol('existing');
	/**“流程起点”符号 */
	static readonly START = Symbol('load start');
	/**“流程终点”符号 */
	static readonly END = Symbol('load end');
	/**默认前后钩子模块的前缀 */
	static HOOK_NAME: [pre: string, post: string] = ['pre:', 'post:'];
	constructor({ actions = {}, positions = {}, reusable = false }: LoaderConfig<T, F> = {}) {
		this.reusable = reusable;
		this.countMap[Loader.START] = 1;
		this.countMap[Loader.END] = 1;
		this.addAction(actions);
		this.insert(positions);
	}
	/**是否可以重用 */
	reusable: boolean;
	/**是否已经加载完一次了 */
	loaded = false;
	protected readonly actionMap: MapObj<F[]> = Object.create(null);
	protected readonly postListMap: MapObj<Id[]> = Object.create(null);
	protected readonly positionObjMap: MapObj<PositionObj<T>> = Object.create(null);
	private readonly countMap: MapObj<number> = Object.create(null);
	protected getCount(): MapObj<number> {
		return Object.create(this.countMap);
	}
	private tidyHook(pos: PositionObj<T>, keyName: 'preOf' | 'postOf', order: boolean) {
		const sign = Loader.HOOK_NAME[order ? 0 : 1];
		return order === (keyName === 'postOf')
			? getArray(pos[keyName])
			: getArray(pos[keyName]).map(n => sign + n);
	}
	private tidyMain(idArray: AnyArray<Id>, order: boolean) {
		if (idArray.includes(order ? Loader.END : Loader.START)) throwError(Number(order), Error(`不能在 ${order ? 'END 后' : 'START 前'}插入东西`));
		const sign = Loader.HOOK_NAME[order ? 1 : 0];
		return idArray.map(n => isSymbol(n) ? n : sign + n);
	}
	protected tidy(orderName: 'after' | 'before', pos: PositionObj<T>) {
		const order = orderName === 'after';
		return [
			...(order ? [Loader.START] : []),
			...this.tidyHook(pos, 'preOf', order),
			...this.tidyMain(getArray(pos[orderName]), order),
			...this.tidyHook(pos, 'postOf', order),
		];
	}
	private putInList(id: Id, lazy: boolean, ids: MayArray<Id>) {
		(this.postListMap[id] || (this.postListMap[id] = []))[lazy ? 'push' : 'unshift'](...getArray(ids));
	}
	private plusCount(id: Id, num = 1) {
		this.countMap[id] = (this.countMap[id] || 0) + num;
	}
	protected insertAfter(id: Id, afters: Id[], lazy = false) {
		this.plusCount(id, afters.length);
		afters.forEach(n => this.putInList(n, lazy, id));
	}
	protected insertBefore(id: Id, befores: Id[], lazy = false) {
		befores.forEach(n => this.plusCount(n));
		this.putInList(id, lazy, befores);
	}
	/**
	 * 增加动作回调
	 * @param id 要增加的模块
	 * @param action 动作回调
	 * @param noInsert 若模块不存在，是否不要主动插入
	 */
	addAction(id: Id, action: Action<T, F>, noInsert?: boolean): this;
	/**
	 * 增加多个模块的动作回调
	 * @param actions 各个模块的动作回调
	 * @param noInsert 是否不要主动插入 {@link actions} 中未被插入的模块
	 */
	addAction(actions: Actions<T, F>, noInsert?: boolean): this;
	addAction(id: Id | Actions<T, F>, action?: Action<T, F> | boolean, noInsert: boolean = false) {
		if (typeof id === 'object') {
			const [actions, noInsert] = [id, typeof action === 'boolean' ? action : void 0]
			mapMap(actions, (action, id) => this.addAction(id, action, noInsert));
			return this;
		}
		switch (typeof action) { case 'boolean': case 'undefined': return this; }
		if (!noInsert && this.idSign[id] !== Loader.EXIST) this.insert(id);
		if ('run' in action) action = action.run;
		(this.actionMap[id] || (this.actionMap[id] = [])).push(...getArray(action));
		return this;
	}
	/**
	 * 插入模块
	 * @param id 模块标识符
	 * @param position 位置信息
	 * @param action 动作回调
	 */
	insert(id: Id, position?: Position<T>, action?: Action<T, F> | null): this;
	/**
	 * 插入多个模块
	 * @param positions 各个模块的位置信息
	 */
	insert(positions: Positions<T>): this;
	insert(id: Id | Positions<T>, position: Position<T> = {}, action: Action<T, F> | null = null) {
		if (typeof id === 'object') {
			const positions = id;
			positions instanceof Array
				? positions.forEach((ele, idx) => 
					typeof ele !== 'object'
						? this.insert(ele, idx ? positions[idx - 1] : {})
						: (
							this.insert(ele[0]),
							ele.length < 2 || ele.reduce((p, t) => (this.insert(t, p), t))
						)
				)
				: mapMap(positions, (position, id) => this.insert(id, position));
			return this;
		}
		if (typeof position !== 'object') position = [position];
		if ('length' in position) position = { after: position };
		this.registerId(true, id);
		this.registerId(false, position);
		if (action) this.addAction(id, action);
		if (isSymbol(id)) {
			this.insertAfter(id, this.tidy('after', position));
			this.insertBefore(id, this.tidy('before', position));
			this.positionObjMap[id] = position;
			if (position.preJudger) this.preJudgerSign[id] = Loader.EXIST;
			if (position.postJudger) this.postJudgerSign[id] = Loader.EXIST;
		} else {
			const [preId, postId] = Loader.HOOK_NAME.map(n => n + id);
			this.insertAfter(preId, this.tidy('after', position));
			this.insertAfter(id, [preId], true);
			this.insertBefore(id, [postId], true);
			this.insertBefore(postId, this.tidy('before', position));
			this.positionObjMap[preId] = { preJudger: position.preJudger };
			this.positionObjMap[postId] = { postJudger: position.postJudger };
			if (position.preJudger) this.preJudgerSign[preId] = Loader.EXIST;
			if (position.postJudger) this.postJudgerSign[postId] = Loader.EXIST;
		}
		return this;
	}
	private readonly idSign: MapObj<symbol> = {
		[Loader.START]: Loader.EXIST,
		[Loader.END]: Loader.EXIST,
	};
	protected registerId(method: true, id: Id): void;
	protected registerId(method: false, usedId: PositionObj<T> | Id): void;
	protected registerId(...args: [true, Id] | [false, PositionObj<T> | Id]): void {
		if (args[0]) return void (this.idSign[args[1]] = Loader.EXIST);
		const usedId = args[1];
		typeof usedId !== 'object'
			? this.idSign[usedId] === Loader.EXIST || (this.idSign[usedId] = Loader.EXISTING)
			: PositionObj.keys.forEach(key => getArray(usedId[key]).forEach(id => this.registerId(false, id)));
	}
	/**检查是否有被引用的模块未被插入 */
	checkLost() {
		const list = Reflect.ownKeys(this.idSign).filter(id => this.idSign[id] === Loader.EXISTING);
		if (list.length) throwError(3, Error('出现了未注册的模块'), { list });
	}
	private checkCircleFrom(id: Id, statMap: MapObj<symbol>, circle: Id[]) {
		if (statMap[id] === Loader.EXIST) return false;
		if (statMap[id] === Loader.EXISTING) {
			circle.splice(0, circle.indexOf(id));
			return true;
		}
		statMap[id] = Loader.EXISTING, circle.push(id);
		for (const p of this.postListMap[id] || []) {
			if (this.checkCircleFrom(p, statMap, circle)) return true;
		}
		statMap[id] = Loader.EXIST, circle.pop();
		return false;
	}
	/**检查是否出现环形引用 */
	checkCircle(id: Id = Loader.START, statMap: MapObj<symbol> = {}) {
		const circle: Id[] = [];
		if (this.checkCircleFrom(id, statMap, circle)) throwError(2, Error('出现环形引用'), { circle });
	}
	private walkAt(id: Id, countMap: MapObj<number>, path: Id[]) {
		if (--countMap[id]) return;
		path.push(id);
		this.postListMap[id]?.forEach(id => this.walkAt(id, countMap, path));
	}
	/**得到运行顺序数组 */
	walk() {
		this.checkLost();
		this.checkCircle();
		const path: Id[] = [];
		this.walkAt(Loader.START, this.getCount(), path);
		return path;
	}
	protected preLoad() {
		if (!this.reusable && this.loaded) return null;
		this.checkLost();
		this.checkCircle();
		this.loaded = true;
		return this.getCount();
	}
	protected judge(hookPosition: 'pre' | 'post', id: Id, n: T) {
		return this.positionObjMap[id]?.[`${hookPosition}Judger`]?.(n) === false; 
	}
	/**
	 * 加载！
	 * @param n 初始运行参数
	 */
	abstract load(n: T): Promise<T> | T;
	private readonly preJudgerSign: MapObj<symbol> = {};
	private readonly postJudgerSign: MapObj<symbol> = {};
	private dotLine(a: Id, b: Id, sign?: boolean) {
		return [
			'\t',
			!sign && new Set([a, b, Loader.END, Loader.START]).size < 4 && '// ',
			`"${a.toString()}" -> "${b.toString()}"`,
			(this.postJudgerSign[a] === Loader.EXIST || this.preJudgerSign[b] === Loader.EXIST) && ' [style = dashed]',
		].filter(n => n).join('');
	}
	/**
	 * 获取当前模块依赖关系的 DOT 图
	 * @param sign 是否显示起点和终点
	 */
	showDot(sign?: boolean) {
		return [...new Set([
			'digraph loader {',
			...Reflect.ownKeys(this.idSign)
				.filter(id => this.idSign[id] === Loader.EXIST && id !== Loader.END)
				.map(id => isSymbol(id) ? id.toString() : Loader.HOOK_NAME[1] + id)
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
	/**
	 * 显示当前模块依赖关系的图
	 *
	 * 如果在浏览器里，就打开新标签页，否则就把网址输出到控制台
	 * @param sign 是否显示起点和终点
	 */
	show(sign?: boolean) {
		const url = `http://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(this.showDot(sign))}`;
		typeof window === 'undefined' ? console.log(url) : window.open(url);
	}
}
export interface LoaderAsyncConfig<T = unknown> extends LoaderConfig<T> {
	/**最大同时任务数量 */
	concurrency?: number;
}
/**异步模块加载器 */
export class LoaderAsync<T = void> extends Loader<T, AsyncCallback<T>> {
	constructor({ concurrency = 0, ...loaderConfig }: LoaderAsyncConfig<T> = {}) {
		super(loaderConfig)
		this.concurrency = concurrency;
	}
	/**最大同时任务数量 */
	concurrency: number;
	private async loadSub(id: Id, countMap: MapObj<number>, n: T, limiter: Queue): Promise<T> {
		if (--countMap[id]) return n;
		if (this.judge('pre', id, n)) return n;
		if (id in this.actionMap) {
			const release = await new Promise<Callback<void>>(grab => limiter.push(() => new Promise(res => grab(res))));
			let waiter = new Promise<T>(res => res(n));
			this.actionMap[id].forEach(fn => waiter = waiter.then(fn).then(r => r || n));
			n = await waiter;
			release();
		}
		if (this.judge('post', id, n)) return n;
		if (id in this.postListMap) await Promise.all(this.postListMap[id].map(id => this.loadSub(id, countMap, n, limiter).then(r => n = r)));
		return n;
	}
	override async load(n: T) {
		const countMap = this.preLoad();
		if (!countMap) return n;
		const limiter = new Queue({ concurrency: this.concurrency, autostart: true });
		n = await this.loadSub(Loader.START, countMap, n, limiter);
		n = await this.loadSub(Loader.END, countMap, n, limiter);
		return n;
	}
}
/**模块加载器 */
export class LoaderSync<T = void> extends Loader<T, Callback<T>> {
	private loadSub(id: Id, countMap: MapObj<number>, n: T) {
		if (--countMap[id]) return n;
		if (this.judge('pre', id, n)) return n;
		this.actionMap[id]?.forEach(fn => n = fn(n) || n);
		if (this.judge('post', id, n)) return n;
		this.postListMap[id]?.forEach(id => n = this.loadSub(id, countMap, n));
		return n;
	}
	override load(n: T) {
		const countMap = this.preLoad();
		if (!countMap) return n;
		n = this.loadSub(Loader.START, countMap, n);
		n = this.loadSub(Loader.END, countMap, n);
		return n;
	}
}
export default LoaderSync;
