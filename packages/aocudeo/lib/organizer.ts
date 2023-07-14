/**
 * 组织器类
 * @module aocudeo/lib/organizer
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './organizer';

import { Id, Hookable } from './types';
import { Positions } from './position';
import { WorkerMap, WorkerAsyncFunction, WorkerFunction } from './worker';

export interface OrganizerConfig<T = unknown, F extends WorkerAsyncFunction<T> = WorkerAsyncFunction<T>> {
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
	abstract execute(data: T): PromiseLike<T> | T;
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
/**异步模块加载器 */
export class OrganizerAsync<T = void> extends Organizer<T, WorkerAsyncFunction<T>> {
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
	override async execute(data: T) {
// 		const countMap = this.preLoad();
// 		if (!countMap) return data;
// 		const limiter = new Queue({ concurrency: this.concurrency, autostart: true });
// 		data = await this.executeAt(Loader.START, countMap, data, limiter);
		return data;
	}
}
/**模块加载器 */
export class OrganizerSync<T = void> extends Organizer<T, WorkerFunction<T>> {
// 	private loadSub(id: Id, countMap: MapObj<number>, n: T) {
// 		if (--countMap[id]) return n;
// 		if (this.judge('pre', id, n)) return n;
// 		this.actionMap[id]?.forEach(fn => n = fn(n) || n);
// 		if (this.judge('post', id, n)) return n;
// 		this.postListMap[id]?.forEach(id => n = this.loadSub(id, countMap, n));
// 		return n;
// 	}
	override execute(data: T) {
// 		const countMap = this.preLoad();
// 		if (!countMap) return n;
// 		n = this.loadSub(Loader.START, countMap, n);
// 		n = this.loadSub(Loader.END, countMap, n);
		return data;
	}
}
