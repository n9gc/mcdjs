/// <reference path="exports.d.ts" />
/**
 * @module mcdjs/lib-splited/nodes
 * @version 0.0.1
 * @license GPL-2.0-or-later
 */
declare module './nodes';
import 'reflect-metadata';
import { Base, Node } from '../lib/magast/nodes';
import type Operator from '../lib/magast/operator';
import { Expression as GameExpr, SelectString, Sim } from '../lib/types/game';
import type { Vcb } from '../lib/types/tool';
export declare class CodeBlock extends Base {
    ntype: 0;
    static readonly 'zh-CN' = "\u4EE3\u7801\u5757";
    constructor(operm: Operator, cbOri: Vcb);
    readonly nodes: Node[];
}
export declare class Command extends Base {
    readonly exec: string;
    cond: boolean;
    ntype: 1;
    static readonly 'zh-CN' = "\u5355\u547D\u4EE4";
    constructor(operm: Operator, exec: string, cond?: boolean);
}
export declare class Branch extends Base {
    ntype: 2;
    static readonly 'zh-CN' = "\u6761\u4EF6\u5206\u652F";
    constructor(operm: Operator, cond: GameExpr, tdoOri: Vcb, fdoOri: Vcb);
    readonly cond: Expression;
    readonly tdo: CodeBlock;
    readonly fdo: CodeBlock;
}
export declare class CBGroup extends Base {
    repeat: boolean;
    tick: number;
    ntype: 3;
    static readonly 'zh-CN' = "\u547D\u4EE4\u65B9\u5757\u7EC4";
    constructor(operm: Operator, repeat: boolean, tick: number);
    readonly cbs: Node[];
}
export declare class NameSpace extends Base {
    ntype: 4;
    static readonly 'zh-CN' = "\u547D\u540D\u7A7A\u95F4";
    constructor(operm: Operator, sign: string, content: Vcb);
    readonly sign: string;
    readonly content: CodeBlock;
}
export declare class CommandRslt extends Base {
    readonly check: number;
    ntype: 5;
    static readonly 'zh-CN' = "\u547D\u4EE4\u6761\u4EF6";
    constructor(operm: Operator, check: number);
}
export declare class Selector extends Base {
    readonly range: SelectString;
    readonly simData?: Sim.Tag | undefined;
    ntype: 6;
    static readonly 'zh-CN' = "\u9009\u4E2D\u7684\u4EBA";
    constructor(operm: Operator, range?: SelectString, simData?: Sim.Tag | undefined);
}
declare abstract class BaseExpressionSig extends Base {
    constructor(operm: Operator, a: Expression);
    a: Expression;
}
declare abstract class BaseExpressionBin extends Base {
    constructor(operm: Operator, a: Expression, b: Expression);
    a: Expression;
    b: Expression;
}
export declare class ExpressionAnd extends BaseExpressionBin {
    ntype: 7;
    static readonly 'zh-CN' = "\u4E0E\u8868\u8FBE\u5F0F";
}
export declare class ExpressionOr extends BaseExpressionBin {
    ntype: 8;
    static readonly 'zh-CN' = "\u6216\u8868\u8FBE\u5F0F";
}
export declare class ExpressionNot extends BaseExpressionSig {
    ntype: 9;
    static readonly 'zh-CN' = "\u975E\u8868\u8FBE\u5F0F";
}
export declare class ExpressionNand extends BaseExpressionBin {
    ntype: 10;
    static readonly 'zh-CN' = "\u4E0E\u975E\u8868\u8FBE\u5F0F";
}
export declare class ExpressionNor extends BaseExpressionBin {
    ntype: 11;
    static readonly 'zh-CN' = "\u6216\u975E\u8868\u8FBE\u5F0F";
}
export declare class ExpressionXor extends BaseExpressionBin {
    ntype: 12;
    static readonly 'zh-CN' = "\u5F02\u6216\u8868\u8FBE\u5F0F";
}
export declare class ExpressionXnor extends BaseExpressionBin {
    ntype: 13;
    static readonly 'zh-CN' = "\u540C\u6216\u8868\u8FBE\u5F0F";
}
export type Expression = Selector | CommandRslt | ExpressionAnd | ExpressionOr | ExpressionNot | ExpressionNand | ExpressionNor | ExpressionXor | ExpressionXnor;
export declare function getExpression(operm: Operator, expr: GameExpr): Expression;
export {};
