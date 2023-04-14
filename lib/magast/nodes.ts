/**
 * 抽象语法树节点定义模块
 * @module mcdjs/lib/magast/nodes
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './nodes';

import { Types } from '../alload';
import { Text } from '../config';
import { holdErr } from '../errlib';

export enum NType {
	SystemDad,
	System,
	CodeBlock,
	Command,
	ConditionCommand,
	ConditionSelector,
	Branch,
	Block,
	ExpressionAnd,
	ExpressionOr,
	ExpressionNot,
	ExpressionNand,
	ExpressionNor,
	ExpressionXor,
	ExpressionXnor,
}
Text.regEnum('NType', {
	[NType.SystemDad]: '指令系统的父节点',
	[NType.System]: '指令系统',
	[NType.CodeBlock]: '代码块',
	[NType.Command]: '单命令',
	[NType.ConditionCommand]: '有条件命令方块',
	[NType.ConditionSelector]: '选择器',
	[NType.Branch]: '条件分支',
	[NType.Block]: '命令方块',
	[NType.ExpressionAnd]: '与表达式',
	[NType.ExpressionOr]: '或表达式',
	[NType.ExpressionNot]: '非表达式',
	[NType.ExpressionNand]: '与非表达式',
	[NType.ExpressionNor]: '或非表达式',
	[NType.ExpressionXor]: '异或表达式',
	[NType.ExpressionXnor]: '同或表达式',
});
export type NTypeKey = keyof typeof NType;
export function isNType(n: string): n is NTypeKey {
	return typeof NType[n as any] === 'number';
}
export function eachNType<T>(cb: (value: number, key: NTypeKey) => T): T[] {
	const rslt = [];
	let i = 0;
	while (i in NType) rslt.push(cb(i, NType[i++] as NTypeKey));
	return rslt;
}
export const keyNType = eachNType((_, k) => k) as Types.AnyArr<NTypeKey>;
export const valueNType = eachNType((v => v)) as readonly NType[];
export interface Node {
	ntype: NType;
	index: number;
	tips?: string;
	endTimer?: ReturnType<typeof holdErr>;
}
export type InitedNodeAttr =
	| 'index'
	| 'ntype';
export interface NodeSystemDad extends Node {
	ntype: NType.SystemDad;
	index: -1;
	system: NodeSystem;
}
export interface NodeSystem extends Node {
	ntype: NType.System;
	tips: string;
	nodes: AllNode[];
}
export interface NodeCodeBlock extends Node {
	ntype: NType.CodeBlock;
	nodes: AllNode[];
}
export interface NodeCommand extends Node {
	ntype: NType.Command;
	exec: string;
}
export interface NodeConditionCommand extends Node {
	ntype: NType.ConditionCommand;
	pos: number;
}
export interface NodeConditionSelector extends Node {
	ntype: NType.ConditionSelector;
	range: Types.Select.At;
	expr: Types.Expression;
}
export interface NodeBranch extends Node {
	ntype: NType.Branch;
	expr: NodeConditionCommand | NodeConditionSelector;
	tdo: NodeCodeBlock;
	fdo: NodeCodeBlock;
}
export interface NodeBlock extends Node {
	ntype: NType.Block;
	con: boolean;
	cbtype: Types.CbType;
}
export type NodeExpression =
	| NodeExpressionAnd
	| NodeExpressionOr
	| NodeExpressionNot
	| NodeExpressionNand
	| NodeExpressionNor
	| NodeExpressionXor
	| NodeExpressionXnor;
export interface NodeExpressionAnd extends Node {
	ntype: NType.ExpressionAnd;
	oFirst: Types.SimTag | NodeExpression;
	oSecond: Types.SimTag | NodeExpression;
}
export interface NodeExpressionOr extends Node {
	ntype: NType.ExpressionOr;
	oFirst: Types.SimTag | NodeExpression;
	oSecond: Types.SimTag | NodeExpression;
}
export interface NodeExpressionNot extends Node {
	ntype: NType.ExpressionNot;
	oFirst: Types.SimTag | NodeExpression;
}
export interface NodeExpressionNand extends Node {
	ntype: NType.ExpressionNand;
	oFirst: Types.SimTag | NodeExpression;
	oSecond: Types.SimTag | NodeExpression;
}
export interface NodeExpressionNor extends Node {
	ntype: NType.ExpressionNor;
	oFirst: Types.SimTag | NodeExpression;
	oSecond: Types.SimTag | NodeExpression;
}
export interface NodeExpressionXor extends Node {
	ntype: NType.ExpressionXor;
	oFirst: Types.SimTag | NodeExpression;
	oSecond: Types.SimTag | NodeExpression;
}
export interface NodeExpressionXnor extends Node {
	ntype: NType.ExpressionXnor;
	oFirst: Types.SimTag | NodeExpression;
	oSecond: Types.SimTag | NodeExpression;
}
export type AllNode =
	| NodeSystemDad
	| NodeSystem
	| NodeCodeBlock
	| NodeConditionCommand
	| NodeConditionSelector
	| NodeBranch
	| NodeBlock
	| NodeExpression
	| NodeCommand;

export type SelNode<T extends NType> = AllNode & { ntype: T; };
export type AST = NodeSystem;
export type GotSelNode<T extends NType = NType> =
	& Exclude<SelNode<T>, 'index'>
	& { endTimer: Node['endTimer'] & {}; };
