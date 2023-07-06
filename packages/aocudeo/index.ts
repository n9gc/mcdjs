/**
 * 胡乱加载器
 * @module aocudeo
 * @version 4.0.0-dev.2.7
 * @license GPL-2.0-or-later
 */
declare module '.';

import Queue from "queue";

type MayArray<T> = readonly T[] | T;
export type Callback<T> = (n: T) => T | void;
export type AsyncCallback<T> = (n: T) => void | T | PromiseLike<void | T>;
/**拦截器 */
type Judger<T> = (n: T) => boolean;
type MapLike<T> = Map<Id, T> | MapObj<T>;
/**可挂钩子的标识符类型 */
export type Hookable = string | number;
/**标识符类型 */
export type Id = symbol | Hookable;
type MapObj<T, K extends Id = Id> = { [I in K]: T | undefined };
/**模块的动作回调 */
export type Action<T, F extends AsyncCallback<T>> = { run: F; } | MayArray<F>;
export type Actions<T, F extends AsyncCallback<T> = AsyncCallback<T>> = MapLike<Action<T, F>>;
/**拦截器对象 */
interface JudgerObj<T> {
	/**运行前的拦截器，若返回 `false` 则停止运行此模块 */
	preJudger?: Judger<T>;
	/**运行后的拦截器，若返回 `false` 则停止运行依赖此模块的模块 */
	postJudger?: Judger<T>;
}
export class SurePosition {
	static keys = ['after', 'before'] as const;
	private static fillSet(surePosition: Partial<SurePosition>): asserts surePosition is SurePosition {
		if (!surePosition.after) surePosition.after = new Set<Id>();
		if (!surePosition.before) surePosition.before = new Set<Id>();
	}
	static fill(surePosition: Partial<SurePosition>) {
		this.fillSet(surePosition);
		return surePosition;
	}
	constructor(positionObj: PositionObj<any>) {
		const preOf = getArray(positionObj.preOf);
		const postOf = getArray(positionObj.postOf);
		this.after = new Set([
			...getArray(positionObj.after),
			...preOf.map(id => Loader.affixPre + id),
			...postOf.map(id => Loader.affixMain + id),
		]);
		this.before = new Set([
			...getArray(positionObj.before),
			...preOf.map(id => Loader.affixMain + id),
			...postOf.map(id => Loader.affixPost + id),
		]);
	}
	after: Set<Id>;
	before: Set<Id>;
}
/**位置信息对象 */
export class PositionObj<T> implements JudgerObj<T> {
	static keys = [...SurePosition.keys, 'preOf', 'postOf'] as const;
	constructor(position: Position<T>) {
		if (typeof position !== 'object') position = [position];
		if ('length' in position) this.after = position;
		else return position;
	}
	preJudger?: Judger<T>;
	postJudger?: Judger<T>;
	/**此模块依赖的模块 */
	after?: MayArray<Id>;
	/**依赖此模块的模块 */
	before?: MayArray<Id>;
	/**挂在哪些模块前面作为钩子 */
	preOf?: MayArray<Hookable>;
	/**挂在哪些模块后面作为钩子 */
	postOf?: MayArray<Hookable>;
}
/**{@link PositionObj.after|`PositionObj#after`} 的简写 */
type PositionArray = readonly Id[];
/**位置信息 */
export type Position<T = unknown> = PositionObj<T> | PositionArray | Id;
export type Positions<T = unknown> = MapLike<Position<T>> | MayArray<readonly Id[]>;
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
function getArray<T>(mayArray?: MayArray<T>) {
	return typeof mayArray === 'undefined' ? [] : mayArray instanceof Array ? mayArray : [mayArray];
}
function throwError(type: ErrorType, tracker: Error, infos?: any): never {
	throw new AocudeoError(type, tracker, infos);
}
function mapMapObj<N>(mapObj: MapObj<N>, walker: (value: N, id: Id) => void) {
	Reflect.ownKeys(mapObj).forEach(id => {
		const n = mapObj[id];
		if (typeof n !== 'undefined') walker(n, id);
	});
}
/**遍历 {@link map} */
function mapMap<N>(map: MapObj<N> | Map<Id, N>, walker: (value: N, id: Id) => void) {
	map instanceof Map
		? map.forEach(walker)
		: mapMapObj(map, walker);
}
// abstract class ActionMap<T, F extends AsyncCallback<T>> {
// 	protected actionMap: MapObj<F[]> = Object.create(null);
// 	add(id: Id, action: Action<T, F>) {
// 		if ('run' in action) action = action.run;
// 		(this.actionMap[id] || (this.actionMap[id] = [])).push(...getArray(action));
// 	}
// 	abstract run(id: Id, n: T, limiter?: Queue): T | PromiseLike<T>;
// }
// class ActionMapSync<T> extends ActionMap<T, Callback<T>> {
// 	override run(id: Id, n: T) {
// 		this.actionMap[id]?.forEach(fn => n = fn(n) ?? n);
// 		return n;
// 	}
// }
// class ActionMapAsync<T> extends ActionMap<T, AsyncCallback<T>> {
// 	override async run(id: Id, n: T, limiter: Queue) {
// 		if (!this.actionMap[id]?.length) return n;
// 		const release = await new Promise<Callback<void>>(grab => limiter.push(() => new Promise(res => grab(res))));
// 		let waiter = new Promise<T>(res => res(n));
// 		this.actionMap[id]?.forEach(fn => waiter = waiter.then(fn).then(r => r || n));
// 		n = await waiter;
// 		release();
// 		return n;
// 	}
// }
export class SignChecker<I extends Id> {
	protected ensureds = new Set<I>();
	protected requireds = new Set<I>();
	countEnsureds() {
		return this.ensureds.size;
	}
	getEnsureds() {
		return new Set(this.ensureds);
	}
	isEnsured(id: I) {
		return this.ensureds.has(id);
	}
	isRequired(id: I) {
		return this.requireds.has(id);
	}
	ensure(...ids: I[]) {
		ids.forEach(id => {
			this.ensureds.add(id);
			this.requireds.delete(id);
		});
	}
	require(...ids: I[]) {
		ids.forEach(id => this.ensureds.has(id) || this.requireds.add(id));
	}
	isSafe() {
		const list = [...this.requireds];
		return list.length ? list : false;
		// throwError(3, Error('出现了未注册的模块'), { list });
	}
}
export class PositionMap<T> {
	constructor() {
		this.insertedChecker.ensure(Loader.START, Loader.END);
		this.insert(Loader.END, Loader.START);
	}
	readonly insertedChecker = new SignChecker<Id>;
	protected readonly countMap = new Map<Id, number>();
	protected readonly surePositionMap = new Map<Id, SurePosition>();
	private push(id: Id, surePosition: SurePosition) {
		let mapObj: SurePosition;
		let t = this.surePositionMap.get(id);
		t ? mapObj = t : this.surePositionMap.set(id, mapObj = new SurePosition({}));
		SurePosition.keys.forEach(key => surePosition[key]?.forEach(id => mapObj[key].add(id)));
		const len = mapObj.after.size + mapObj.before.size;
		this.countMap.set(id, len);
		return len;
	}
	protected readonly splitedChecker = new SignChecker<Hookable>;
	private surelyInsert(id: Id, surePosition: SurePosition): number {
		if (typeof id === 'symbol' || !this.splitedChecker.isEnsured(id)) return this.push(id, surePosition);
		const { preId, mainId, postId } = Loader.getAffixed(id);
		const len = this.countMap.get(mainId)!
			+ this.surelyInsert(preId, SurePosition.fill({ after: surePosition.after }))
			+ this.surelyInsert(postId, SurePosition.fill({ before: surePosition.before }));
		this.countMap.set(id, len);
		return len;
	}
	private split(id: Hookable) {
		const { preId, mainId, postId } = Loader.getAffixed(id);
		this.splitedChecker.ensure(id);
		this.insertedChecker.ensure(preId, mainId, postId);
		this.push(preId, SurePosition.fill({ after: this.surePositionMap.get(id)?.after }));
		this.push(mainId, new SurePosition({}));
		this.push(postId, SurePosition.fill({ before: this.surePositionMap.get(id)?.before }));
		this.surePositionMap.delete(id);
	}
	private getHookedOf(id: Id) {
		if (typeof id !== 'string') return false;
		for (const affix of Loader.getAffixs()) if (id.slice(0, affix.length) === affix) return id.slice(affix.length);
		return false;
	}
	private requireSplited(id: Hookable | false) {
		if (id === false) return false;
		if (this.splitedChecker.isRequired(id)) return false;
		if (this.splitedChecker.isEnsured(id)) return true;
		if (this.requireSplited(this.getHookedOf(id))) {
			this.split(id);
			return true;
		} else {
			this.splitedChecker.require(id);
			return false;
		}
	}
	private clearHolded(id: Hookable) {
		this.split(id);
		Loader.getAffixs().forEach(affix => this.splitedChecker.isRequired(affix + id) && this.clearHolded(affix + id));
	}
	private ensureSplited(id: Id | false) {
		if (typeof id === 'symbol') return this.insertedChecker.ensure(id), false;
		if (id === false) return true;
		if (this.splitedChecker.isEnsured(id)) return false;
		if (this.splitedChecker.isRequired(id)) {
			if (this.ensureSplited(this.getHookedOf(id))) {
				this.insertedChecker.ensure(id);
				this.clearHolded(id);
			}
			return false;
		} else {
			if (this.ensureSplited(this.getHookedOf(id))) this.insertedChecker.ensure(id);
			this.split(id);
			return false;
		}
	}
	insert(id: Id, position: Position<T>) {
		const siz = this.insertedChecker.countEnsureds();
		const len = this.countMap.get(id);
		const surePosition = new SurePosition(new PositionObj(position));
		SurePosition.keys.forEach(key => this.insertedChecker.require(...surePosition[key]));
		SurePosition.keys.forEach(key => surePosition[key]?.forEach(id => this.requireSplited(this.getHookedOf(id))));
		this.ensureSplited(id);
		this.surelyInsert(id, surePosition);
		if (this.insertedChecker.countEnsureds() !== siz || this.countMap.get(id) !== len) this.graphCache = null;
	}
	protected graphCache: null | Graph = null;
	getGraph() {
		return this.graphCache || (this.graphCache = new Graph(this.surePositionMap, this.splitedChecker));
	}
}
export class Graph {
	readonly edgeMap: MapObj<Id[]> = Object.create(null);
	readonly indegreeMap: MapObj<number> = Object.create(null);
	private putInList(id: Id, ids: Id[]) {
		(this.edgeMap[id] || (this.edgeMap[id] = [])).push(...ids);
	}
	private plusCount(id: Id, num = 1) {
		this.indegreeMap[id] = (this.indegreeMap[id] || 0) + num;
	}
	private insertAfter(id: Id, after: Id[]) {
		after.forEach(n => this.putInList(n, [id]));
		this.plusCount(id, after.length);
	}
	private insertBefore(id: Id, before: Id[]) {
		this.putInList(id, before);
		before.forEach(n => this.plusCount(n));
	}
	private insert(id: Id, after: Id[], before: Id[]) {
		this.insertAfter(id, after);
		this.insertBefore(id, before);
	}
	private getEdgeOf(id: Id, direction: 'Pre' | 'Main' | 'Post'): Id {
		if (typeof id !== 'symbol' && this.splitedChecker.isEnsured(id)) return this.getEdgeOf(Loader[`affix${direction}`] + id, direction);
		return id;
	}
	private insertEdge(id: Id, after: Id[], before: Id[]) {
		this.insertAfter(this.getEdgeOf(id, 'Pre'), after.map(id => this.getEdgeOf(id, 'Post')));
		this.insertBefore(this.getEdgeOf(id, 'Post'), before.map(id => this.getEdgeOf(id, 'Pre')));
	}
	constructor(
		surePositionMap: Map<Id, SurePosition>,
		private splitedChecker: SignChecker<Hookable>,
	) {
		surePositionMap.forEach(({ after, before }, id) => this.insertEdge(id, [...after], [...before]));
		[...surePositionMap.keys()].filter(id => id !== Loader.END && Loader.START).forEach(id => this.insert(id, [Loader.START], [Loader.END]));
		splitedChecker.getEnsureds().forEach(id => this.insertEdge(Loader.affixMain + id, [Loader.affixPre + id], [Loader.affixPost + id]));
	}
	private safeResult: readonly Id[] | false | null = null;
	isSafe() {
		return this.safeResult === null
			? this.safeResult = new CircleChecker(this.edgeMap).result
			: this.safeResult;
	}
}
export class CircleChecker {
	private readonly circle: Id[] = [];
	private readonly checkedChecker = new SignChecker<Id>();
	private out(id: Id) {
		this.circle.splice(0, this.circle.indexOf(id));
		return true;
	}
	private mark(id: Id) {
		this.checkedChecker.require(id);
		this.circle.push(id);
	}
	private unmark(id: Id) {
		this.checkedChecker.ensure(id);
		this.circle.pop();
	}
	private from(id: Id) {
		if (this.checkedChecker.isEnsured(id)) return false;
		if (this.checkedChecker.isRequired(id)) return this.out(id);
		this.mark(id);
		for (const p of this.edgeMap[id]!) if (this.from(p)) return true;
		this.unmark(id);
		return false;
	}
	readonly result: false | readonly Id[];
	constructor(
		private edgeMap: MapObj<readonly Id[]>,
	) {
		this.result = this.from(Loader.START) && this.circle;
		// throwError(2, Error('出现环形引用'), { circle });
	}
}
export interface LoaderConfig<T = unknown, F extends AsyncCallback<T> = Callback<T>> {
	/**是否可以重用 */
	reusable?: boolean;
	/**各个模块的动作回调 */
	actions?: Actions<T, F>;
	/**各个模块的位置信息 */
	positions?: Positions<T>;
}
export abstract class Loader<T, F extends AsyncCallback<T>> {
	/**“流程起点”符号 */
	static readonly START = Symbol('load start');
	/**“流程终点”符号 */
	static readonly END = Symbol('load end');
	static affixPre = 'pre:';
	static affixMain = 'main:';
	static affixPost = 'post:';
	static getAffixs() {
		return [
			this.affixPre,
			this.affixMain,
			this.affixPost,
		];
	}
	static getAffixed(id: Hookable) {
		return {
			preId: Loader.affixPre + id,
			mainId: Loader.affixMain + id,
			postId: Loader.affixPost + id,
		};
	}
//	constructor({ actions = {}, positions = {}, reusable = false }: LoaderConfig<T, F> = {}) {
//		this.reusable = reusable;
//		this.addAction(actions);
//		this.insert(positions);
//	}
//	/**是否可以重用 */
//	reusable: boolean;
//	/**是否已经加载完一次了 */
//	loaded = false;
//	protected readonly signChecker = new SignChecker<T>();
//	protected readonly positionMap = new PositionMap(this.signChecker);
//	protected abstract readonly actionMap: ActionMap<T, F>;
//	/**
//	 * 增加动作回调
//	 * @param id 要增加的模块
//	 * @param action 动作回调
//	 * @param noInsert 若模块不存在，是否不要主动插入
//	 */
//	addAction(id: Id, action: Action<T, F>, noInsert?: boolean): this;
//	/**
//	 * 增加多个模块的动作回调
//	 * @param actions 各个模块的动作回调
//	 * @param noInsert 是否不要主动插入 {@link actions} 中未被插入的模块
//	 */
//	addAction(actions: Actions<T, F>, noInsert?: boolean): this;
//	addAction(id: Id | Actions<T, F>, action?: Action<T, F> | boolean, noInsert: boolean = false) {
//		if (typeof id === 'object') {
//			const [actions, noInsert] = [id, typeof action === 'boolean' ? action : void 0];
//			mapMap(actions, (action, id) => this.addAction(id, action, noInsert));
//			return this;
//		}
//		switch (typeof action) { case 'boolean': case 'undefined': return this; }
//		if (!noInsert) this.positionMap.insertOne(id);
//		this.actionMap.add(id, action);
//		return this;
//	}
//	private insertMany(positions: Positions<T>) {
//		positions instanceof Array
//			? positions.forEach((ele, idx) =>
//				typeof ele !== 'object'
//					? this.insert(ele, idx ? positions[idx - 1] : {})
//					: (
//						this.insert(ele[0]),
//						ele.length < 2 || ele.reduce((p, t) => (this.insert(t, p), t))
//					)
//			)
//			: mapMap(positions, (position, id) => this.insert(id, position));
//		return this;
//	}
//	/**
//	 * 插入模块
//	 * @param id 模块标识符
//	 * @param position 位置信息
//	 * @param action 动作回调
//	 */
//	insert(id: Id, position?: Position<T>, action?: Action<T, F> | null): this;
//	/**
//	 * 插入多个模块
//	 * @param positions 各个模块的位置信息
//	 */
//	insert(positions: Positions<T>): this;
//	insert(id: Id | Positions<T>, position: Position<T> = {}, action: Action<T, F> | null = null) {
//		if (typeof id === 'object') return this.insertMany(id);
//		if (action) this.addAction(id, action);
//		this.positionMap.insert(id, position);
//		return this;
//	}
//	private walkAt(id: Id, countMap: MapObj<number>, path: Id[]) {
//		if (--countMap[id]) return;
//		path.push(id);
//		this.postListMap[id]?.forEach(id => this.walkAt(id, countMap, path));
//	}
//	/**得到运行顺序数组 */
//	walk() {
//		this.checkLost();
//		this.checkCircle();
//		const path: Id[] = [];
//		this.walkAt(Loader.START, this.getCount(), path);
//		return path;
//	}
//	protected preLoad() {
//		if (!this.reusable && this.loaded) return null;
//		this.checkLost();
//		this.checkCircle();
//		this.loaded = true;
//		return this.getCount();
//	}
//	protected judge(hookPosition: 'pre' | 'post', id: Id, n: T) {
//		return this.positionObjMap[id]?.[`${hookPosition}Judger`]?.(n) === false;
//	}
//	/**
//	 * 加载！
//	 * @param n 初始运行参数
//	 */
//	abstract load(n: T): Promise<T> | T;
//	private readonly preJudgerSign: MapObj<symbol> = {};
//	private readonly postJudgerSign: MapObj<symbol> = {};
//	private dotLine(a: Id, b: Id, sign?: boolean) {
//		return [
//			'\t',
//			!sign && new Set([a, b, Loader.END, Loader.START]).size < 4 && '// ',
//			`"${a.toString()}" -> "${b.toString()}"`,
//			(this.postJudgerSign[a] === Loader.EXIST || this.preJudgerSign[b] === Loader.EXIST) && ' [style = dashed]',
//		].filter(n => n).join('');
//	}
//	/**
//	 * 获取当前模块依赖关系的 DOT 图
//	 * @param sign 是否显示起点和终点
//	 */
//	showDot(sign?: boolean) {
//		return [...new Set([
//			'digraph loader {',
//			...Reflect.ownKeys(this.idSign)
//				.filter(id => this.idSign[id] === Loader.EXIST && id !== Loader.END)
//				.map(id => typeof id === 'symbol' ? id.toString() : Loader.hookName[1] + id)
//				.map(id => this.dotLine(id, Loader.END, sign)),
//			...Reflect.ownKeys(this.postListMap)
//				.map(a => this.postListMap[a].map(b => this.dotLine(a, b, sign)))
//				.flat(),
//			// Object.keys(this.idSign)
//			// 	.map(n => [
//			// 		`subgraph cluster_${n} {`,
//			// 		`\t"${n}";`,
//			// 		Loader.HOOK_NAME.map(p => `\t"${p}${n}";`),
//			// 		'}',
//			// 	])
//			// 	.flat(2)
//			// 	.map(n => '\t' + n)
//			// 	.join('\n'),
//			'}',
//		])].join('\n');
//	}
//	/**
//	 * 显示当前模块依赖关系的图
//	 *
//	 * 如果在浏览器里，就打开新标签页，否则就把网址输出到控制台
//	 * @param sign 是否显示起点和终点
//	 */
//	show(sign?: boolean) {
//		const url = `http://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(this.showDot(sign))}`;
//		typeof window === 'undefined' ? console.log(url) : window.open(url);
//	}
}
// export interface LoaderAsyncConfig<T = unknown> extends LoaderConfig<T> {
// 	/**最大同时任务数量 */
// 	concurrency?: number;
// }
// /**异步模块加载器 */
// export class LoaderAsync<T = void> extends Loader<T, AsyncCallback<T>> {
// 	constructor({ concurrency = 0, ...loaderConfig }: LoaderAsyncConfig<T> = {}) {
// 		super(loaderConfig);
// 		this.concurrency = concurrency;
// 	}
// 	/**最大同时任务数量 */
// 	concurrency: number;
// 	private async loadSub(id: Id, countMap: MapObj<number>, n: T, limiter: Queue): Promise<T> {
// 		if (--countMap[id]) return n;
// 		if (this.judge('pre', id, n)) return n;
// 		if (id in this.actionMap) {
// 			const release = await new Promise<Callback<void>>(grab => limiter.push(() => new Promise(res => grab(res))));
// 			let waiter = new Promise<T>(res => res(n));
// 			this.actionMap[id].forEach(fn => waiter = waiter.then(fn).then(r => r || n));
// 			n = await waiter;
// 			release();
// 		}
// 		if (this.judge('post', id, n)) return n;
// 		if (id in this.postListMap) await Promise.all(this.postListMap[id].map(id => this.loadSub(id, countMap, n, limiter).then(r => n = r)));
// 		return n;
// 	}
// 	override async load(n: T) {
// 		const countMap = this.preLoad();
// 		if (!countMap) return n;
// 		const limiter = new Queue({ concurrency: this.concurrency, autostart: true });
// 		n = await this.loadSub(Loader.START, countMap, n, limiter);
// 		n = await this.loadSub(Loader.END, countMap, n, limiter);
// 		return n;
// 	}
// }
// /**模块加载器 */
// export class LoaderSync<T = void> extends Loader<T, Callback<T>> {
// 	private loadSub(id: Id, countMap: MapObj<number>, n: T) {
// 		if (--countMap[id]) return n;
// 		if (this.judge('pre', id, n)) return n;
// 		this.actionMap[id]?.forEach(fn => n = fn(n) || n);
// 		if (this.judge('post', id, n)) return n;
// 		this.postListMap[id]?.forEach(id => n = this.loadSub(id, countMap, n));
// 		return n;
// 	}
// 	override load(n: T) {
// 		const countMap = this.preLoad();
// 		if (!countMap) return n;
// 		n = this.loadSub(Loader.START, countMap, n);
// 		n = this.loadSub(Loader.END, countMap, n);
// 		return n;
// 	}
// }
// export default LoaderSync;
