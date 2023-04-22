/**
 * 抽象语法树节点类型定义模块
 * @module @mcdjs/base/lib/types/nodes
 * @version 1.0.4
 * @license GPL-3.0-or-later
 */
declare module './nodes';

import type { AnyArr, CbType, Expression, Select, SimTag } from '.';
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
export const tranumNType = Text.regEnum('NType', NType, {
	SystemDad: '指令系统的父节点',
	System: '指令系统',
	CodeBlock: '代码块',
	Command: '单命令',
	ConditionCommand: '有条件命令方块',
	ConditionSelector: '选择器',
	Branch: '条件分支',
	Block: '命令方块',
	ExpressionAnd: '与表达式',
	ExpressionOr: '或表达式',
	ExpressionNot: '非表达式',
	ExpressionNand: '与非表达式',
	ExpressionNor: '或非表达式',
	ExpressionXor: '异或表达式',
	ExpressionXnor: '同或表达式',
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
export const keyNType = eachNType((_, k) => k) as AnyArr<NTypeKey>;
export const valueNType = eachNType((v => v)) as readonly NType[];
export interface Node {
	ntype: NType;
	index: number;
	tips?: string;
	endTimer?: ReturnType<typeof holdErr>;
}
export type InitedNodeAttr =
	| 'index'
	| 'ntype'
	;
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
	range: Select.At;
	expr: Expression;
}
export type NodeCondition =
	| NodeConditionCommand
	| NodeConditionSelector
	;
export interface NodeBranch extends Node {
	ntype: NType.Branch;
	expr: NodeCondition;
	tdo: NodeCodeBlock;
	fdo: NodeCodeBlock;
}
export interface NodeBlock extends Node {
	ntype: NType.Block;
	con: boolean;
	cbtype: CbType;
}
export interface NodeExpressionAnd extends Node {
	ntype: NType.ExpressionAnd;
	oFirst: MagExpression;
	oSecond: MagExpression;
}
export interface NodeExpressionOr extends Node {
	ntype: NType.ExpressionOr;
	oFirst: MagExpression;
	oSecond: MagExpression;
}
export interface NodeExpressionNot extends Node {
	ntype: NType.ExpressionNot;
	oFirst: MagExpression;
}
export interface NodeExpressionNand extends Node {
	ntype: NType.ExpressionNand;
	oFirst: MagExpression;
	oSecond: MagExpression;
}
export interface NodeExpressionNor extends Node {
	ntype: NType.ExpressionNor;
	oFirst: MagExpression;
	oSecond: MagExpression;
}
export interface NodeExpressionXor extends Node {
	ntype: NType.ExpressionXor;
	oFirst: MagExpression;
	oSecond: MagExpression;
}
export interface NodeExpressionXnor extends Node {
	ntype: NType.ExpressionXnor;
	oFirst: MagExpression;
	oSecond: MagExpression;
}
export type NodeExpression =
	| NodeExpressionAnd
	| NodeExpressionOr
	| NodeExpressionNot
	| NodeExpressionNand
	| NodeExpressionNor
	| NodeExpressionXor
	| NodeExpressionXnor
	;
export type MagExpression =
	| NodeExpression
	| SimTag
	;
export type AllNode =
	| NodeSystemDad
	| NodeSystem
	| NodeCodeBlock
	| NodeCondition
	| NodeBranch
	| NodeBlock
	| NodeExpression
	| NodeCommand
	;

export type SelNode<T extends NType> = AllNode & { ntype: T; };
export type AST = NodeSystem;
export type GotSelNode<T extends NType = NType> =
	& Exclude<SelNode<T>, 'index'>
	& { endTimer: Node['endTimer'] & {}; }
	;
