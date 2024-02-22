/**
 * 操作器无关API库
 * @module mcdjs/lib/api/static
 * @version 1.0.1
 * @license GPL-2.0-or-later
 */
declare module './static';
import { TypeId, CommandRslt, Selected, Expression, SimTag, SelectString } from "../types/game";
import * as me from './static';
declare const _default: new () => typeof me;
export default _default;
export declare class CommandRsltClass implements CommandRslt {
    readonly index: number;
    constructor(index: number);
    readonly tid: TypeId.CommandRslt;
}
export declare class SelectedClass implements Selected {
    expr: Expression;
    constructor(expr: Expression);
    readonly tid: TypeId.Selected;
}
export declare let tagExist: {
    [name: string]: true;
};
/**标签实体 */
export declare class Tag implements SimTag {
    name: string;
    constructor(name?: string);
    readonly tid: TypeId.SimTag;
    toString(): string;
}
export declare const AND = "and";
export declare const OR = "or";
export declare const NOT = "not";
export declare const NAND = "nand";
export declare const NOR = "nor";
export declare const XOR = "xor";
export declare const XNOR = "xnor";
declare function binCalcsFn(sign: Expression.OperatorBin, exprs: binCalcsFn.UnlimitedArgs): Expression.Calcable;
declare namespace binCalcsFn {
    type Args = [Expression, Expression];
    type UnlimitedArgs = [Expression, Expression, ...Expression[]];
}
export declare function and(...expr: binCalcsFn.UnlimitedArgs): Expression.Calcable;
export declare function or(...expr: binCalcsFn.UnlimitedArgs): Expression.Calcable;
export declare function not(expr: Expression): Expression;
export declare function nand(...expr: binCalcsFn.Args): Expression.Calcable;
export declare function nor(...expr: binCalcsFn.Args): Expression.Calcable;
export declare function xor(...expr: binCalcsFn.Args): Expression.Calcable;
export declare function xnor(...expr: binCalcsFn.Args): Expression.Calcable;
/**有条件地选择实体 */
export declare function select(expr: Expression, range?: SelectString): Selected;
