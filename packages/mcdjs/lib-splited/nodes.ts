/**
 * @module mcdjs/lib-splited/nodes
 * @version 0.0.1
 * @license GPL-2.0-or-later
 */
/// <reference path="./exports.ts" />
declare module './nodes';

import 'reflect-metadata';
import { EType, throwErr } from '../lib/errlib';
import { Base, NType, Node, NodeAttr } from '../lib/magast/nodes';
import type Operator from '../lib/magast/operator';
import {
	Expression as GameExpr,
	SelectString,
	Sim,
	TypeId,
} from '../lib/types/game';
import type { Vcb } from '../lib/types/tool';

export class CodeBlock extends Base {
	ntype = NType.CodeBlock;
	static readonly 'zh-CN' = '代码块';
	constructor(operm: Operator, cbOri: Vcb) {
		super(operm);
		const dadScope = operm.scope;
		operm.scope = this;
		cbOri();
		operm.scope = dadScope;
	}
	@NodeAttr readonly nodes: Node[] = [];
}
export class Command extends Base {
	ntype = NType.Command;
	static readonly 'zh-CN' = '单命令';
	constructor(
		operm: Operator,
		public readonly exec: string,
		public cond = false,
	) { super(operm); }
}
export class Branch extends Base {
	ntype = NType.Branch;
	static readonly 'zh-CN' = '条件分支';
	constructor(operm: Operator, cond: GameExpr, tdoOri: Vcb, fdoOri: Vcb) {
		super(operm);
		this.cond = getExpression(operm, cond);
		this.tdo = new CodeBlock(operm, tdoOri);
		this.fdo = new CodeBlock(operm, fdoOri);
	}
	@NodeAttr readonly cond: Expression;
	@NodeAttr readonly tdo: CodeBlock;
	@NodeAttr readonly fdo: CodeBlock;
}
export class CBGroup extends Base {
	ntype = NType.CBGroup;
	static readonly 'zh-CN' = '命令方块组';
	constructor(
		operm: Operator,
		public repeat: boolean,
		public tick: number,
	) { super(operm); }
	@NodeAttr readonly cbs: Node[] = [];
}
export class NameSpace extends Base {
	ntype = NType.NameSpace;
	static readonly 'zh-CN' = '命名空间';
	constructor(operm: Operator, sign: string, content: Vcb) {
		super(operm);
		this.sign = sign;
		this.content = new CodeBlock(operm, content);
	}
	readonly sign: string;
	@NodeAttr readonly content: CodeBlock;
}

export class CommandRslt extends Base {
	ntype = NType.CommandRslt;
	static readonly 'zh-CN' = '命令条件';
	constructor(
		operm: Operator,
		public readonly check: number,
	) { super(operm); }
}
export class Selector extends Base {
	ntype = NType.Selector;
	static readonly 'zh-CN' = '选中的人';
	constructor(
		operm: Operator,
		public readonly range: SelectString = '@e',
		public readonly simData?: Sim,
	) { super(operm); }
}
abstract class BaseExpressionSig extends Base {
	constructor(operm: Operator, a: Expression) {
		super(operm);
		this.a = a;
	}
	@NodeAttr a: Expression;
}
abstract class BaseExpressionBin extends Base {
	constructor(operm: Operator, a: Expression, b: Expression) {
		super(operm);
		this.a = a;
		this.b = b;
	}
	@NodeAttr a: Expression;
	@NodeAttr b: Expression;
}
export class ExpressionAnd extends BaseExpressionBin {
	ntype = NType.ExpressionAnd;
	static readonly 'zh-CN' = '与表达式';
}
export class ExpressionOr extends BaseExpressionBin {
	ntype = NType.ExpressionOr;
	static readonly 'zh-CN' = '或表达式';
}
export class ExpressionNot extends BaseExpressionSig {
	ntype = NType.ExpressionNot;
	static readonly 'zh-CN' = '非表达式';
}
export class ExpressionNand extends BaseExpressionBin {
	ntype = NType.ExpressionNand;
	static readonly 'zh-CN' = '与非表达式';
}
export class ExpressionNor extends BaseExpressionBin {
	ntype = NType.ExpressionNor;
	static readonly 'zh-CN' = '或非表达式';
}
export class ExpressionXor extends BaseExpressionBin {
	ntype = NType.ExpressionXor;
	static readonly 'zh-CN' = '异或表达式';
}
export class ExpressionXnor extends BaseExpressionBin {
	ntype = NType.ExpressionXnor;
	static readonly 'zh-CN' = '同或表达式';
}
export type Expression =
	| Selector
	| CommandRslt
	| ExpressionAnd
	| ExpressionOr
	| ExpressionNot
	| ExpressionNand
	| ExpressionNor
	| ExpressionXor
	| ExpressionXnor
	;
const signCls = {
	and: ExpressionAnd,
	'&': ExpressionAnd,
	or: ExpressionOr,
	'|': ExpressionOr,
	not: ExpressionNot,
	'!': ExpressionNot,
	nand: ExpressionNand,
	nor: ExpressionNor,
	xor: ExpressionXor,
	xnor: ExpressionXnor,
} as const;

export function getExpression(operm: Operator, expr: GameExpr): Expression {
	if (typeof expr === 'string') return new Selector(operm, expr);
	if ('tid' in expr) switch (expr.tid) {
		case TypeId.CommandRslt: return new CommandRslt(operm, expr.index);
		case TypeId.Selected: return getExpression(operm, expr.expr);
		case TypeId.SimTag: return new Selector(operm, void 0, expr);
	}
	if (expr.length === 2) return new signCls[expr[0]](
		operm,
		getExpression(operm, expr[1]),
	);
	if (expr.length === 3) return new signCls[expr[1]](
		operm,
		getExpression(operm, expr[0]),
		getExpression(operm, expr[2]),
	);
	return throwErr(EType.ErrIllegalParameter, Error(), expr);
}
