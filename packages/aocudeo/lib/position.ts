/**
 * 位置相关定义
 * @module aocudeo/lib/position
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './position';

import { Judger, MapLike, MayArray, Id, Hookable } from './types';
import { getArray, SurePositionMap } from './util';
import { Organizer } from './organizer';
import { SignChecker } from './checker';
import { Graph } from './graph';

/**拦截器对象 */
export interface JudgerObj<T> {
	/**运行前的拦截器，若返回 `false` 则停止运行此模块 */
	preJudger?: Judger<T>;
	/**运行后的拦截器，若返回 `false` 则停止运行依赖此模块的模块 */
	postJudger?: Judger<T>;
}
/**{@link PositionObj.after|`PositionObj#after`} 的简写 */
export type PositionArray = readonly Id[];
/**位置信息 */
export type Position<T = unknown> = PositionObj<T> | PositionArray | Id;
export type Positions<T = unknown> = MapLike<Position<T>> | MayArray<readonly Id[]>;
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
