/**
 * 抽象语法树节点类型定义模块
 * @module mcdjs/lib/magast/nodes
 * @version 1.6.0
 * @license GPL-2.0-or-later
 */
declare module './nodes';

import 'reflect-metadata';
import Temp from '../alload';
import { regEnum } from '../config/text';
import { EType, throwErr } from '../errlib';
import { Enum, listKeyOf } from '../types/base';
import {
	Expression as GameExpr,
	SelectString,
	Sim,
	TypeId,
} from '../types/game';
import type { Vcb } from '../types/tool';
import type Operator from './operator';

export interface NodeBase {
	ntype: NType;
	index: number;
	tips?: string;
}
abstract class Base implements NodeBase {
	static readonly nodeAttr: string[] = [];
	constructor(operm: Operator, getTip = true) {
		this.index = operm.plusNodeNum();
		if (getTip) {
			const tips = Temp.tip.getTip();
			if (tips) this.tips = tips;
		}
	}
	abstract readonly ntype: NType;
	readonly index: number;
	tips?: string;
}
export function isNode(n: any): n is Node {
	return n instanceof Base;
}
function NodeAttr(proto: Base, key: string) {
	let nodeAttr: string[];
	Reflect.hasMetadata('nodeAttr', proto)
		? nodeAttr = Reflect.getMetadata('nodeAttr', proto)
		: Reflect.defineMetadata('nodeAttr', nodeAttr = [], proto);
	nodeAttr.push(key);
}
export namespace Node {
	export class Top extends Base {
		ntype = NType.Top;
		static readonly 'zh-CN' = '树顶空位';
		constructor(operm: Operator, system: System) {
			super(operm);
			this.system = system;
		}
		@NodeAttr readonly system: System;
	}
	export class System extends Base {
		ntype = NType.System;
		static readonly 'zh-CN' = '指令系统';
		constructor(
			operm: Operator,
			public readonly tips: string,
		) { super(operm); }
		@NodeAttr readonly nodes: Node[] = [];
	}
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
			this.tdo = new Node.CodeBlock(operm, tdoOri);
			this.fdo = new Node.CodeBlock(operm, fdoOri);
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
}

export namespace Node {
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
}
const signCls = {
	and: Node.ExpressionAnd,
	'&': Node.ExpressionAnd,
	or: Node.ExpressionOr,
	'|': Node.ExpressionOr,
	not: Node.ExpressionNot,
	'!': Node.ExpressionNot,
	nand: Node.ExpressionNand,
	nor: Node.ExpressionNor,
	xor: Node.ExpressionXor,
	xnor: Node.ExpressionXnor,
} as const;
export function getExpression(operm: Operator, expr: GameExpr): Node.Expression {
	if (typeof expr === 'string') return new Node.Selector(operm, expr);
	if ('tid' in expr) switch (expr.tid) {
		case TypeId.CommandRslt: return new Node.CommandRslt(operm, expr.index);
		case TypeId.Selected: return getExpression(operm, expr.expr);
		case TypeId.SimTag: return new Node.Selector(operm, void 0, expr);
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

export const NType = Enum.from(listKeyOf(Node));
export type NTypeObj = typeof NType;
type NTypeStrKey = Enum.KeyOf<NTypeObj>;
export type NType<T extends NTypeStrKey = NTypeStrKey> = Enum.ValueOf<NTypeObj, T>;
export type NTypeKey<V extends NType = NType> = Enum.KeyOf<NTypeObj, V>;
export const tranumNType = regEnum('NType', NType, Node);

export type Node<T extends NType = NType> = InstanceType<(typeof Node)[NTypeKey<T>]>;
export type AST = Node.System;
// export type GotSelNode<T extends NType = NType> = Exclude<Node<T>, 'index'>;
