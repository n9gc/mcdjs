/**
 * 位置相关定义
 * @module aocudeo/lib/position
 * @version 1.3.0
 * @license GPL-2.0-or-later
 */
declare module './position';
import { SignChecker } from './checker';
import { Diagram } from './diagram';
import { Graph } from './executor';
import type { Hookable, Id, Judger, MapLike, MayArray } from './types';
import { SurePositionMap } from './util';
/**拦截器对象 */
export interface JudgerObj {
}
/**{@link PositionObj.after|`PositionObj#after`} 的简写 */
export type PositionArray = readonly Id[];
/**位置信息 */
export type Position = PositionObj | PositionArray | Id;
export type Positions = MapLike<Position> | MayArray<readonly Id[]>;
export declare class SurePosition {
    static keys: readonly ["after", "before"];
    private static fillSet;
    static fill(surePosition: Partial<SurePosition>): SurePosition;
    constructor(positionObj: PositionObj);
    after: Set<Id>;
    before: Set<Id>;
}
/**位置信息对象 */
export declare class PositionObj implements JudgerObj {
    static keys: readonly ["after", "before", "preOf", "postOf"];
    constructor(position: Position);
    preJudger?: Judger;
    postJudger?: Judger;
    /**此模块依赖的模块 */
    after?: MayArray<Id>;
    /**依赖此模块的模块 */
    before?: MayArray<Id>;
    /**挂在哪些模块前面作为钩子 */
    preOf?: MayArray<Hookable>;
    /**挂在哪些模块后面作为钩子 */
    postOf?: MayArray<Hookable>;
}
export declare class PositionMap {
    constructor();
    protected readonly insertedChecker: SignChecker<Id>;
    protected readonly countMap: Map<Id, number>;
    protected readonly surePositionMap: SurePositionMap<Id>;
    private push;
    protected readonly splitedChecker: SignChecker<Hookable>;
    private surelyInsert;
    private split;
    private requireSplited;
    private clearHolded;
    private ensureSplited;
    insert(id: Id, position: Position): void;
    private clearCache;
    protected graphCache: null | Graph;
    getGraph(): Graph;
    protected diagramCache: null | Diagram;
    getDiagram(): Diagram;
    protected insertError: [0 | 1, Id] | null;
    private throwInsertError;
    tryThrow(): void;
}
