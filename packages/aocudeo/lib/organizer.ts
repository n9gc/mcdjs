/**
 * 组织器类
 * @module aocudeo/lib/organizer
 * @version 1.5.0
 * @license GPL-2.0-or-later
 */
declare module './organizer';

import { Position, PositionMap, Positions } from './position';
import type { Hookable, Id } from './types';
import { isArray, isIdArray, mapMap } from './util';
import {
	Limiter,
	LimiterOption,
	Worker,
	WorkerAsyncFunction,
	WorkerFunction,
	WorkerManager,
	Workers,
} from './worker';

export class AffixsToolKit {
	static readonly hookTypes = [
		'Pre',
		'Main',
		'Post',
	] as const;
	private static _affixPre = 'pre:';
	static get affixPre() { return this._affixPre; }
	static set affixPre(n: string) { this.setAffix('Pre', n); }
	private static _affixMain = 'main:';
	static get affixMain() { return this._affixMain; }
	static set affixMain(n: string) { this.setAffix('Main', n); }
	private static _affixPost = 'post:';
	static get affixPost() { return this._affixPost; }
	static set affixPost(n: string) { this.setAffix('Post', n); }
	protected static setAffix(type: 'Pre' | 'Main' | 'Post', n: string) {
		this[`_affix${type}`] = n;
		this.affixs = this.getAffixs();
		this.hookTypeMap = this.getHookTypeMap();
	}
	static affixs = this.getAffixs();
	static getAffixedOf(id: Hookable) {
		return {
			preId: this._affixPre + id,
			mainId: this._affixMain + id,
			postId: this._affixPost + id,
		};
	}
	/**@deprecated 请使用 {@link AffixsToolKit.getAffixedOf|`AffixsToolKit.getAffixedOf`} 代替此方法 */
	static getAffixed(id: Hookable) { return this.getAffixedOf(id); }
	protected static getAffixs() {
		return [
			this._affixPre,
			this._affixMain,
			this._affixPost,
		] as const;
	}
	protected static getHookTypeMap() {
		return {
			[this._affixPre]: 'Pre',
			[this._affixMain]: 'Main',
			[this._affixPost]: 'Post',
		} as const;
	}
	private static hookTypeMap = this.getHookTypeMap();
	static getHookTypeOf(id: Id | false) {
		if (typeof id !== 'string') return false;
		for (const affix of Organizer.affixs) if (id.slice(0, affix.length) === affix) return this.hookTypeMap[affix];
		return false;
	}
	/**@deprecated 请使用 {@link AffixsToolKit.getHookTypeOf|`AffixsToolKit.getHookTypeOf`} 代替此方法 */
	static getHookType(id: Id) { return this.getHookTypeOf(id); }
	static getHookedOf(id: Id | false) {
		if (typeof id !== 'string') return false;
		for (const affix of Organizer.affixs) if (id.slice(0, affix.length) === affix) return id.slice(affix.length);
		return false;
	}
	private static ensureHookedPart(hooked: string | false, type: 'Post' | 'Pre'): 'Pre' | 'Post' | 'Body' {
		const hookType = Organizer.getHookTypeOf(hooked);
		if (!hookType) return type;
		if (hookType !== type) return 'Body';
		return this.ensureHookedPart(Organizer.getHookedOf(hooked), type);
	}
	static getHookedPartOf(id: Id) {
		if (typeof id === 'symbol') return 'All';
		const hookType = Organizer.getHookTypeOf(id);
		if (!hookType || hookType === 'Main') return 'Body';
		return this.ensureHookedPart(Organizer.getHookedOf(id), hookType);
	}
}
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
	workers?: Workers<T, F>;
	/**
	 * 各个模块的位置信息
	 * @default {}
	 */
	positions?: Positions<T>;
}
export abstract class Organizer<T, F extends WorkerAsyncFunction<T>> extends AffixsToolKit {
	static readonly start = Symbol('load start');
	static readonly end = Symbol('load end');
	static readonly unknown = Symbol('unknown module');
	constructor({ workers = {}, positions = {}, reusable }: OrganizerConfig<T, F> = {}) {
		super();
		if (typeof reusable !== 'undefined') this.reusable = reusable;
		this.addWorkers(workers);
		this.addPositions(positions);
	}
	/**是否可以重用 */
	reusable = true;
	/**是否已经加载完一次了 */
	loaded = false;
	protected readonly positionMap = new PositionMap<T>();
	/**
	 * 插入模块
	 * @param id 模块标识符
	 * @param position 位置信息
	 * @param worker 动作回调
	 */
	addPosition(id: Id, position: Position<T> = {}, worker: Worker<T, F> | null = null) {
		if (worker) this.addWorker(id, worker);
		this.positionMap.insert(id, position);
		return this;
	}
	/**
	 * 插入多个模块
	 * @param positions 各个模块的位置信息
	 */
	addPositions(positions: Positions<T>) {
		isArray(positions)
			? (isIdArray(positions) ? [positions] : positions).forEach(array => {
				this.addPosition(array[0]);
				array.length < 2 || array.reduce((p, t) => (this.addPosition(t, p), t));
			})
			: mapMap(positions, (position, id) => this.addPosition(id, position));
		return this;
	}
	protected readonly workerManager = new WorkerManager<T, F>();
	/**
	 * 增加动作回调
	 * @param id 要增加的模块
	 * @param worker 动作回调
	 * @param noInsert 若模块不存在，是否不要主动插入
	 */
	addWorker(id: Id, worker: Worker<T, F>, noInsert?: boolean) {
		if (!noInsert) this.positionMap.insert(id, {});
		this.workerManager.add(id, worker);
		return this;
	}
	/**
	 * 增加多个模块的动作回调
	 * @param workers 各个模块的动作回调
	 * @param noInsert 是否不要主动插入 {@link workers} 中未被插入的模块
	 */
	addWorkers(workers: Workers<T, F>, noInsert?: boolean) {
		mapMap(workers, (worker, id) => this.addWorker(id, worker, noInsert));
		return this;
	}
	tryThrow() {
		this.positionMap.tryThrow();
	}
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
	protected getExecutor(data: T) {
		return this.positionMap.getGraph().getExecutor(this.workerManager.getRunner(data));
	}
	/**
	 * 加载！
	 * @param data 初始运行参数
	 */
	execute(data?: T): T | Promise<T> | boolean {
		if (!this.reusable && this.loaded) return true;
		this.tryThrow();
		this.loaded = true;
		return false;
	}
	getDiagram() {
		return this.positionMap.getDiagram();
	}
}
export interface OrganizerAsyncConfig<T = unknown> extends OrganizerConfig<T> {
	/**
	 * 最大同时任务数量
	 * @see {@link Queue.concurrency|`Queue#concurrency`}
	 * @default 0
	 */
	concurrency?: number;
}
/**异步模块加载器 */
export class OrganizerAsync<T = void> extends Organizer<T, WorkerAsyncFunction<T>> {
	constructor({ concurrency = 0, ...organizerConfig }: OrganizerAsyncConfig<T> = {}) {
		super(organizerConfig);
		this.concurrency = concurrency;
	}
	/**最大同时任务数量 */
	concurrency: number;
	override execute(data: T, limiterOption: Limiter | LimiterOption = {}) {
		return super.execute()
			? data
			: this.getExecutor(data).executeAsync(new Limiter(limiterOption));
	}
}
/**模块加载器 */
export class OrganizerSync<T = void> extends Organizer<T, WorkerFunction<T>> {
	override execute(data: T) {
		return super.execute()
			? data
			: this.getExecutor(data).executeSync();
	}
}
