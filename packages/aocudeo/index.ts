/**
 * 胡乱加载器
 * @module aocudeo
 * @version 4.0.0-dev.3
 * @license GPL-2.0-or-later
 */
declare module '.';

import Queue from "queue";

type MayArray<T> = readonly T[] | T;
/**拦截器 */
type Judger<T> = (n: T) => boolean;
type MapLike<T> = Map<Id, T> | MapObj<T>;
/**可挂钩子的标识符类型 */
export type Hookable = string | number;
/**标识符类型 */
export type Id = symbol | Hookable;
type MapObj<T, K extends Id = Id> = { [I in K]: T | undefined };
/**模块的动作回调 */
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
		SurePosition.keys.forEach(key => surePosition[key] || (surePosition[key] = new Set()));
	}
	static fill(surePosition: Partial<SurePosition>) {
		this.fillSet(surePosition);
		return surePosition;
	}
	constructor(positionObj: PositionObj<any>) {
		const preOf = getArray(positionObj.preOf || []);
		const postOf = getArray(positionObj.postOf || []);
		this.after = new Set([
			...getArray(positionObj.after || []),
			...preOf.map(id => Organizer.affixPre + id),
			...postOf.map(id => Organizer.affixMain + id),
		]);
		this.before = new Set([
			...getArray(positionObj.before || []),
			...preOf.map(id => Organizer.affixMain + id),
			...postOf.map(id => Organizer.affixPost + id),
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
	/**在 {@link Organizer.start|`Loader.START`} 前插入模块 */
	InsertBeforeStart,
	/**在 {@link Organizer.end|`Loader.END`} 后插入模块 */
	InsertAfterEnd,
	/**出现了环形引用 */
	CircularReference,
	/**加载时仍有被引用的模块未被插入 */
	UnregistedCodeUnits,
}
interface ReadonlyArrayMap<K, T> extends ReadonlyMap<K, readonly T[]> { }
abstract class InitializableMap<K, V> extends Map<K, V> {
	protected abstract initializeValue(): V;
	forceGet(key: K) {
		let value = this.get(key);
		if (value) return value;
		value = this.initializeValue();
		this.set(key, value);
		return value;
	}
}
class SurePositionMap<K> extends InitializableMap<K, SurePosition> {
	protected initializeValue() {
		return new SurePosition({});
	}
}
class ArrayMap<K, T> extends InitializableMap<K, T[]> {
	protected initializeValue(): T[] {
		return [];
	}
	push(key: K, ...items: T[]) {
		this.forceGet(key).push(...items);
	}
}
const isArray: (n: any) => n is readonly any[] = Array.isArray;
function getArray<T>(mayArray: MayArray<T>) {
	return isArray(mayArray) ? mayArray : [mayArray];
}
// export class AocudeoError {
// 	constructor(
// 		type: ErrorType,
// 		tracker: Error,
// 		infos?: any,
// 	) {
// 		this.type = ErrorType[type] as keyof typeof ErrorType;
// 		Object.assign(this, infos);
// 		this.tracker = tracker;
// 	}
// 	readonly type;
// 	declare readonly tracker;
// }
// function throwError(type: ErrorType, tracker: Error, infos?: any): never {
// 	throw new AocudeoError(type, tracker, infos);
// }
// function mapMapObj<N>(mapObj: MapObj<N>, walker: (value: N, id: Id) => void) {
// 	Reflect.ownKeys(mapObj).forEach(id => {
// 		const n = mapObj[id];
// 		if (typeof n !== 'undefined') walker(n, id);
// 	});
// }
// /**遍历 {@link map} */
// function mapMap<N>(map: MapObj<N> | Map<Id, N>, walker: (value: N, id: Id) => void) {
// 	map instanceof Map
// 		? map.forEach(walker)
// 		: mapMapObj(map, walker);
// }
export class WorkerContext<T> {
	constructor(
		public readonly id: Id,
		public readonly maker: WorkerContextMaker<T>,
	) { }
	get data() {
		return this.maker.data;
	}
	set data(n: T) {
		this.maker.data = n;
	}
}
export class WorkerContextMaker<T> {
	constructor(
		public data: T,
	) { }
	make(id: Id): WorkerContext<T> {
		return new WorkerContext(id, this);
	}
}
export interface WorkerFunction<T> {
	(context: WorkerContext<T>): void;
}
export interface WorkerAsyncFunction<T> {
	(context: WorkerContext<T>): void | PromiseLike<void>;
}
export type Worker<T, F extends WorkerAsyncFunction<T>> = { run: F; } | MayArray<F>;
export type WorkerMap<T, F extends WorkerAsyncFunction<T> = WorkerAsyncFunction<T>> = MapLike<Worker<T, F>>;
abstract class WorkerRunner<T, F extends WorkerAsyncFunction<T>> {
	constructor(
		protected readonly workerMap: ReadonlyArrayMap<Id, F>,
		data: T,
	) {
		this.contextMaker = new WorkerContextMaker(data);
	}
	protected readonly contextMaker: WorkerContextMaker<T>;
	abstract run(id: Id): void | PromiseLike<void>;
}
export class WorkerRunnerSync<T> extends WorkerRunner<T, WorkerFunction<T>> {
	override run(id: Id) {
		this.workerMap.get(id)?.forEach(fn => fn(this.contextMaker.make(id)));
	}
}
export class WorkerRunnerAsync<T> extends WorkerRunner<T, WorkerAsyncFunction<T>> {
	constructor(
		protected limiter: Queue,
		...superArgs: ConstructorParameters<typeof WorkerRunner<T, WorkerAsyncFunction<T>>>
	) { super(...superArgs); }
	override async run(id: Id) {
		if (!this.workerMap.has(id)) return;
		const release = await new Promise<() => void>(grab => this.limiter.push(() => new Promise<void>(res => grab(res))));
		await Promise.all(this.workerMap.get(id)?.map(fn => fn(this.contextMaker.make(id)))!);
		release();
	}
}
abstract class WorkerManager<T, F extends WorkerAsyncFunction<T>> {
	protected readonly workerMap = new ArrayMap<Id, F>();
	add(id: Id, worker: Worker<T, F>) {
		if ('run' in worker) worker = worker.run;
		if (!(worker instanceof Array)) worker = [worker];
		if (!worker.length) return;
		this.workerMap.push(id, ...worker);
	}
	abstract getRunner(data: T, concurrency?: number): WorkerRunner<T, F>;
}
export class WorkerManagerSync<T> extends WorkerManager<T, WorkerFunction<T>> {
	override getRunner(data: T): WorkerRunnerSync<T> {
		return new WorkerRunnerSync(this.workerMap, data);
	}
}
export class WorkerManagerAsync<T> extends WorkerManager<T, WorkerAsyncFunction<T>> {
	override getRunner(data: T, concurrency: number): WorkerRunnerAsync<T> {
		return new WorkerRunnerAsync(new Queue({ autostart: true, concurrency }), this.workerMap, data);
	}
}
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
		this.insertedChecker.ensure(Organizer.start, Organizer.end);
		this.insert(Organizer.end, Organizer.start);
	}
	readonly insertedChecker = new SignChecker<Id>;
	protected readonly countMap = new Map<Id, number>();
	protected readonly surePositionMap = new SurePositionMap<Id>();
	private push(id: Id, surePosition: SurePosition) {
		const mapObj = this.surePositionMap.forceGet(id);
		SurePosition.keys.forEach(key => surePosition[key].forEach(id => mapObj[key].add(id)));
		const len = mapObj.after.size + mapObj.before.size;
		this.countMap.set(id, len);
		return len;
	}
	protected readonly splitedChecker = new SignChecker<Hookable>;
	private surelyInsert(id: Id, surePosition: SurePosition): number {
		if (typeof id === 'symbol' || !this.splitedChecker.isEnsured(id)) return this.push(id, surePosition);
		const { preId, mainId, postId } = Organizer.getAffixed(id);
		const len = this.countMap.get(mainId)!
			+ this.surelyInsert(preId, SurePosition.fill({ after: surePosition.after }))
			+ this.surelyInsert(postId, SurePosition.fill({ before: surePosition.before }));
		this.countMap.set(id, len);
		return len;
	}
	private split(id: Hookable) {
		const { preId, mainId, postId } = Organizer.getAffixed(id);
		this.splitedChecker.ensure(id);
		this.insertedChecker.ensure(preId, mainId, postId);
		this.push(preId, SurePosition.fill({ after: this.surePositionMap.get(id)?.after }));
		this.push(mainId, new SurePosition({}));
		this.push(postId, SurePosition.fill({ before: this.surePositionMap.get(id)?.before }));
		this.surePositionMap.delete(id);
	}
	private requireSplited(id: Hookable | false) {
		if (id === false) return false;
		if (this.splitedChecker.isRequired(id)) return false;
		if (this.splitedChecker.isEnsured(id)) return true;
		if (this.requireSplited(Organizer.getHookedOf(id))) {
			this.split(id);
			return true;
		} else {
			this.splitedChecker.require(id);
			return false;
		}
	}
	private clearHolded(id: Hookable) {
		this.split(id);
		Organizer.getAffixs().forEach(affix => this.splitedChecker.isRequired(affix + id) && this.clearHolded(affix + id));
	}
	private ensureSplited(id: Id | false) {
		if (typeof id === 'symbol') return this.insertedChecker.ensure(id), false;
		if (id === false) return true;
		if (this.splitedChecker.isEnsured(id)) return false;
		if (this.splitedChecker.isRequired(id)) {
			if (this.ensureSplited(Organizer.getHookedOf(id))) {
				this.insertedChecker.ensure(id);
				this.clearHolded(id);
			}
			return false;
		} else {
			if (this.ensureSplited(Organizer.getHookedOf(id))) this.insertedChecker.ensure(id);
			this.split(id);
			return false;
		}
	}
	insert(id: Id, position: Position<T>) {
		const siz = this.insertedChecker.countEnsureds();
		const len = this.countMap.get(id);
		const surePosition = new SurePosition(new PositionObj(position));
		SurePosition.keys.forEach(key => this.insertedChecker.require(...surePosition[key]));
		SurePosition.keys.forEach(key => surePosition[key]?.forEach(id => this.requireSplited(Organizer.getHookedOf(id))));
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
		if (typeof id !== 'symbol' && this.splitedChecker.isEnsured(id)) return this.getEdgeOf(Organizer[`affix${direction}`] + id, direction);
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
		[...surePositionMap.keys()].filter(id => id !== Organizer.end && Organizer.start).forEach(id => this.insert(id, [Organizer.start], [Organizer.end]));
		splitedChecker.getEnsureds().forEach(id => this.insertEdge(Organizer.affixMain + id, [Organizer.affixPre + id], [Organizer.affixPost + id]));
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
		this.result = this.from(Organizer.start) && this.circle;
		// throwError(2, Error('出现环形引用'), { circle });
	}
}
export abstract class Executor<T, F extends WorkerAsyncFunction<T>> {

}
export interface OrganizerConfig<T = unknown, F extends WorkerAsyncFunction<T> = WorkerFunction<T>> {
	/**
	 * 是否可以重用
	 * @default true
	 */
	reusable?: boolean;
	/**
	 * 各个模块的动作回调
	 * @default {}
	 */
	workers?: WorkerMap<T, F>;
	/**
	 * 各个模块的位置信息
	 * @default {}
	 */
	positions?: Positions<T>;
}
export abstract class Organizer<T, F extends WorkerAsyncFunction<T>> {
	static readonly start = Symbol('load start');
	static readonly end = Symbol('load end');
	static readonly unknown = Symbol('unknown module');
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
			preId: Organizer.affixPre + id,
			mainId: Organizer.affixMain + id,
			postId: Organizer.affixPost + id,
		};
	}
	static getHookedOf(id: Id) {
		if (typeof id !== 'string') return false;
		for (const affix of Organizer.getAffixs()) if (id.slice(0, affix.length) === affix) return id.slice(affix.length);
		return false;
	}
	// constructor({ workers = {}, positions = {}, reusable = true }: OrganizerConfig<T, F> = {}) {
	// 	this.reusable = reusable;
	// 	this.addWorkers(workers);
	// 	this.addPositions(positions);
	// }
	// /**是否可以重用 */
	// reusable: boolean;
	// /**是否已经加载完一次了 */
	// loaded = false;
	// protected readonly positionMap = new PositionMap<T>();
	// protected readonly insertedChecker = this.positionMap.insertedChecker;
	// protected abstract readonly workerManager: WorkerManager<T, F>;
	// /**
	//  * 插入模块
	//  * @param id 模块标识符
	//  * @param position 位置信息
	//  * @param worker 动作回调
	//  */
	// addPosition(id: Id, position: Position<T> = {}, worker: Worker<T, F> | null = null) {
	// 	if (worker) this.addWorker(id, worker);
	// 	this.positionMap.insert(id, position);
	// 	return this;
	// }
	// /**
	//  * 插入多个模块
	//  * @param positions 各个模块的位置信息
	//  */
	// addPositions(positions: Positions<T>) {
	// 	isArray(positions)
	// 		? positions.forEach((ele, idx) =>
	// 			typeof ele !== 'object'
	// 				? this.addPosition(ele, idx ? positions[idx - 1] : {})
	// 				: (
	// 					this.addPosition(ele[0]),
	// 					ele.length < 2 || ele.reduce((p, t) => (this.addPosition(t, p), t))
	// 				)
	// 		)
	// 		: mapMap(positions, (position, id) => this.addPosition(id, position));
	// 	return this;
	// }
	// /**
	//  * 增加动作回调
	//  * @param id 要增加的模块
	//  * @param worker 动作回调
	//  * @param noInsert 若模块不存在，是否不要主动插入
	//  */
	// addWorker(id: Id, worker: Worker<T, F>, noInsert?: boolean) {
	// 	if (!noInsert) this.positionMap.insert(id, {});
	// 	this.workerManager.add(id, worker);
	// 	return this;
	// }
	// /**
	//  * 增加多个模块的动作回调
	//  * @param workers 各个模块的动作回调
	//  * @param noInsert 是否不要主动插入 {@link workers} 中未被插入的模块
	//  */
	// addWorkers(workers: WorkerMap<T, F>, noInsert?: boolean) {
	// 	mapMap(workers, (worker, id) => this.addWorker(id, worker, noInsert));
	// 	return this;
	// }
	// private walkAt(id: Id, countMap: MapObj<number>, path: Id[]) {
	// 	if (--countMap[id]) return;
	// 	path.push(id);
	// 	this.postListMap[id]?.forEach(id => this.walkAt(id, countMap, path));
	// }
	// /**得到运行顺序数组 */
	// walk() {
	// 	this.checkLost();
	// 	this.checkCircle();
	// 	const path: Id[] = [];
	// 	this.walkAt(Organizer.start, this.getCount(), path);
	// 	return path;
	// }
	// protected preLoad() {
	// 	if (!this.reusable && this.loaded) return null;
	// 	this.checkLost();
	// 	this.checkCircle();
	// 	this.loaded = true;
	// 	return this.getCount();
	// }
	// protected judge(hookPosition: 'pre' | 'post', id: Id, n: T) {
	// 	return this.positionObjMap[id]?.[`${hookPosition}Judger`]?.(n) === false;
	// }
	/**
	 * 加载！
	 * @param data 初始运行参数
	 */
	abstract execute(data: T): Promise<T> | T;
	// private readonly preJudgerSign: MapObj<symbol> = {};
	// private readonly postJudgerSign: MapObj<symbol> = {};
	// private dotLine(a: Id, b: Id, sign?: boolean) {
	// 	return [
	// 		'\t',
	// 		!sign && new Set([a, b, Organizer.end, Organizer.start]).size < 4 && '// ',
	// 		`"${a.toString()}" -> "${b.toString()}"`,
	// 		(this.postJudgerSign[a] === Organizer.EXIST || this.preJudgerSign[b] === Organizer.EXIST) && ' [style = dashed]',
	// 	].filter(n => n).join('');
	// }
	// /**
	//  * 获取当前模块依赖关系的 DOT 图
	//  * @param sign 是否显示起点和终点
	//  */
	// showDot(sign?: boolean) {
	// 	return [...new Set([
	// 		'digraph loader {',
	// 		...Reflect.ownKeys(this.idSign)
	// 			.filter(id => this.idSign[id] === Organizer.EXIST && id !== Organizer.end)
	// 			.map(id => typeof id === 'symbol' ? id.toString() : Organizer.hookName[1] + id)
	// 			.map(id => this.dotLine(id, Organizer.end, sign)),
	// 		...Reflect.ownKeys(this.postListMap)
	// 			.map(a => this.postListMap[a].map(b => this.dotLine(a, b, sign)))
	// 			.flat(),
	// 		// Object.keys(this.idSign)
	// 		// 	.map(n => [
	// 		// 		`subgraph cluster_${n} {`,
	// 		// 		`\t"${n}";`,
	// 		// 		Loader.HOOK_NAME.map(p => `\t"${p}${n}";`),
	// 		// 		'}',
	// 		// 	])
	// 		// 	.flat(2)
	// 		// 	.map(n => '\t' + n)
	// 		// 	.join('\n'),
	// 		'}',
	// 	])].join('\n');
	// }
	// /**
	//  * 显示当前模块依赖关系的图
	//  *
	//  * 如果在浏览器里，就打开新标签页，否则就把网址输出到控制台
	//  * @param sign 是否显示起点和终点
	//  */
	// show(sign?: boolean) {
	// 	const url = `http://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(this.showDot(sign))}`;
	// 	typeof window === 'undefined' ? console.log(url) : window.open(url);
	// }
}
// export interface OrganizerAsyncConfig<T = unknown> extends OrganizerConfig<T> {
// 	/**最大同时任务数量 */
// 	concurrency?: number;
// }
// /**异步模块加载器 */
// export class OrganizerAsync<T = void> extends Organizer<T, WorkerAsyncFunction<T>> {
// 	constructor({ concurrency = 0, ...loaderConfig }: OrganizerAsyncConfig<T> = {}) {
// 		super(loaderConfig);
// 		this.concurrency = concurrency;
// 	}
// 	protected override readonly workerManager = new WorkerManagerAsync<T>();
// 	/**最大同时任务数量 */
// 	concurrency: number;
// 	private async executeAt(id: Id, countMap: MapObj<number>, n: T, limiter: Queue): Promise<T> {
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
// 		if (id in this.postListMap) await Promise.all(this.postListMap[id].map(id => this.executeAt(id, countMap, n, limiter).then(r => n = r)));
// 		return n;
// 	}
// 	override async execute(data: T) {
// 		const countMap = this.preLoad();
// 		if (!countMap) return data;
// 		const limiter = new Queue({ concurrency: this.concurrency, autostart: true });
// 		data = await this.executeAt(Loader.START, countMap, data, limiter);
// 		return data;
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
