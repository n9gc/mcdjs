/**
 * 抽象语法树节点类型定义模块
 * @module mcdjs/lib/magast/nodes
 * @version 1.3.0
 * @license GPL-3.0-or-later
 */
declare module './nodes';

import Temp from '../alload';
import { regEnum } from '../config/text';
import { EType, throwErr } from '../errlib';
import { Enum, listKeyOf } from '../types/base';
import {
	CbType,
	Condition as GameCond,
	Expression as GameExpr,
	Select,
	Sim,
	TypeId,
} from '../types/game';
import type { Vcb } from '../types/tool';
import type Operator from './operator';
import PathInfo from './pathinfo';
import { PluginEmiter } from './transf';

export interface NodeBase {
	ntype: NType;
	index: number;
	tips?: string;
	walk(emiter: PluginEmiter): void;
}
abstract class Base implements NodeBase {
	constructor(
		operm: Operator,
	) {
		this.index = operm.nodeNum++;
		this.tips || delete this.tips;
	}
	abstract ntype: NType;
	abstract getEles(): Node[];
	walk(emiter: PluginEmiter) {
		emiter.entry(this.ntype, new PathInfo(this as any));
		this.getEles().forEach(node => node.walk(emiter));
		emiter.exit(this.ntype, new PathInfo(this as any));
	};
	index: number;
	tips?= Temp.tip.getTip();
}
export namespace Node {
	export class System extends Base {
		ntype = NType.System;
		static 'zh-CN' = '指令系统';
		constructor(
			operm: Operator,
			public tips: string,
		) { super(operm); }
		nodes: Node[] = [];
		getEles() {
			return this.nodes;
		}
	}
	export class CodeBlock extends Base {
		ntype = NType.CodeBlock;
		static 'zh-CN' = '代码块';
		constructor(operm: Operator, cbOri: Vcb) {
			super(operm);
			const dadScope = operm.scope;
			operm.scope = this;
			cbOri();
			operm.scope = dadScope;
		}
		nodes: Node[] = [];
		getEles() {
			return this.nodes;
		}
	}
	export class Command extends Base {
		ntype = NType.Command;
		static 'zh-CN' = '单命令';
		constructor(
			operm: Operator,
			public exec: string,
		) { super(operm); }
		getEles() {
			return [];
		}
	}
	export class Branch extends Base {
		ntype = NType.Branch;
		static 'zh-CN' = '条件分支';
		constructor(operm: Operator, cond: GameCond, tdoOri: Vcb, fdoOri: Vcb) {
			super(operm);
			this.cond = getCondition(operm, cond);
			this.tdo = new Node.CodeBlock(operm, tdoOri);
			this.fdo = new Node.CodeBlock(operm, fdoOri);
		}
		cond;
		tdo;
		fdo;
		getEles() {
			return [this.cond, this.tdo, this.fdo];
		}
	}
	export class Block extends Base {
		ntype = NType.Block;
		static 'zh-CN' = '命令方块';
		constructor(
			operm: Operator,
			public con: boolean,
			public cbtype: CbType,
		) { super(operm); }
		getEles() {
			return [];
		}
	}
}

export namespace Node {
	export class ConditionCommand extends Base {
		ntype = NType.ConditionCommand;
		static 'zh-CN' = '有条件命令方块';
		constructor(
			operm: Operator,
			public pos: number,
		) { super(operm); }
		getEles() {
			return [];
		}
	}
	export class ConditionSelector extends Base {
		ntype = NType.ConditionSelector;
		static 'zh-CN' = '选择器';
		constructor(
			operm: Operator,
			public range: Select.At,
			public expr: Expression | null,
		) { super(operm); }
		getEles() {
			return this.expr ? [this.expr] : [];
		}
	}
	export type Condition =
		| ConditionCommand
		| ConditionSelector
		;
}
export function getCondition(operm: Operator, cond: GameCond) {
	switch (cond.tid) {
		case TypeId.CommandRslt:
			return new Node.ConditionCommand(operm, cond.index);
		case TypeId.Selected:
			return new Node.ConditionSelector(
				operm,
				cond.range,
				cond.expr && getExpression(operm, cond.expr),
			);
	}
}

export namespace Node {
	export class SimData extends Base {
		ntype = NType.SimData;
		static 'zh-CN' = '模拟数据';
		constructor(
			operm: Operator,
			public data: Sim,
		) { super(operm); }
		getEles() {
			return [];
		}
	}
	abstract class BaseExpressionSig extends Base {
		constructor(
			operm: Operator,
			public a: Expression,
		) { super(operm); }
		getEles() {
			return [this.a];
		}
	}
	abstract class BaseExpressionBin extends Base {
		constructor(
			operm: Operator,
			public a: Expression,
			public b: Expression,
		) { super(operm); }
		getEles() {
			return [this.a, this.b];
		}
	}
	export class ExpressionAnd extends BaseExpressionBin {
		ntype = NType.ExpressionAnd;
		static 'zh-CN' = '与表达式';
	}
	export class ExpressionOr extends BaseExpressionBin {
		ntype = NType.ExpressionOr;
		static 'zh-CN' = '或表达式';
	}
	export class ExpressionNot extends BaseExpressionSig {
		ntype = NType.ExpressionNot;
		static 'zh-CN' = '非表达式';
	}
	export class ExpressionNand extends BaseExpressionBin {
		ntype = NType.ExpressionNand;
		static 'zh-CN' = '与非表达式';
	}
	export class ExpressionNor extends BaseExpressionBin {
		ntype = NType.ExpressionNor;
		static 'zh-CN' = '或非表达式';
	}
	export class ExpressionXor extends BaseExpressionBin {
		ntype = NType.ExpressionXor;
		static 'zh-CN' = '异或表达式';
	}
	export class ExpressionXnor extends BaseExpressionBin {
		ntype = NType.ExpressionXnor;
		static 'zh-CN' = '同或表达式';
	}
	export type Expression =
		| SimData
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
export function getExpression(operm: Operator, expr: GameExpr.Calcable): Node.Expression {
	if ('tid' in expr) return new Node.SimData(operm, expr);
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
type NTypeObj = typeof NType;
type NTypeStrKey = Enum.KeyOf<NTypeObj>;
export type NType<T extends NTypeStrKey = NTypeStrKey> = Enum.ValueOf<NTypeObj, T>;
export type NTypeKey<V extends NType = NType> = Enum.KeyOf<NTypeObj, V>;
export const tranumNType = regEnum('NType', NType, Node);

export type Node<T extends NType = NType> = InstanceType<(typeof Node)[NTypeKey<T>]> & { ntype: T; };
export type AST = Node.System;
export type GotSelNode<T extends NType = NType> = Exclude<Node<T>, 'index'>;
