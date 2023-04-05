/**
 * 抽象语法树操作工具模块
 * @module mcdjs/lib/genast
 * @version 0.1.5
 * @license GPL-3.0-or-later
 */
declare module './genast';

import Temp, { chCommand, Types } from './alload';
import { EType, holdErr } from './errlib';
import Vcb = Types.Vcb;
import TypeId = Types.TypeId;

export enum NType {
	System,
	CodeBlock,
	Command,
	ExpressionCommand,
	ExpressionSelect,
	Branch,
}
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
export interface Node {
	ntype: NType;
	index: number;
	tips?: string;
	endTimer?: ReturnType<typeof holdErr>;
}
export type InitedNodeAttr =
	| 'index'
	| 'ntype';
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
export interface NodeExpressionCommand extends Node {
	ntype: NType.ExpressionCommand;
	pos: number;
}
export interface NodeExpressionSelect extends Node {
	ntype: NType.ExpressionSelect;
	range: Types.Select.At;
	expr: Types.Expression;
}
export interface NodeBranch extends Node {
	ntype: NType.Branch;
	expr: NodeExpressionCommand | NodeExpressionSelect;
	tdo: NodeCodeBlock;
	fdo: NodeCodeBlock;
}
export type AllNode =
	| NodeSystem
	| NodeCodeBlock
	| NodeExpressionCommand
	| NodeExpressionSelect
	| NodeBranch
	| NodeCommand;
export type SelNode<T extends NType> = AllNode & { ntype: T; };
export type AST = NodeSystem;
export class PathInfo<T extends NType = NType> {
	constructor(
		public operm: Operator,
		public node: SelNode<T>,
		public parent: T extends AST['ntype'] ? null : Node,
	) {
		node.endTimer?.();
		delete node.endTimer;
		operm.paths[node.index] = this;
	}
}

export class Operator {
	constructor(tips: string) {
		this.opering = this.ast = this.regPath(
			this.node(
				NType.System,
				{ nodes: [], tips },
			),
			null,
		);
	}
	opering: NodeCodeBlock | NodeSystem;
	ast: AST;
	nodeNum: number = 0;
	paths: { [index: number]: PathInfo; } = {};
	come() {
		chCommand.come(this);
		return this;
	}
	exit() {
		chCommand.exit();
		return this;
	}
	protected node<T extends NType>(ntype: T): SelNode<T>;
	protected node<T extends NType>(ntype: T, body: Omit<SelNode<T>, InitedNodeAttr>): SelNode<T>;
	protected node<T extends NType>(ntype: T, body: Partial<Omit<SelNode<T>, InitedNodeAttr>>, init: true): SelNode<T>;
	protected node(ntype: NType, body: any = {}) {
		const node = body as Node;
		node.ntype = ntype;
		node.index = this.nodeNum++;
		node.endTimer = holdErr(EType.ErrForgetPathInfo, Error(), node);
		const tips = Temp.tip.getTip();
		tips && (node.tips = tips);
		return node;
	}
	protected regPath<T extends NType>(...args: Types.Shifted<ConstructorParameters<typeof PathInfo<T>>>) {
		new PathInfo(this, ...args);
		return args[0];
	}
	protected block(cbOri: Vcb) {
		const nBlk = this.node(NType.CodeBlock, {
			nodes: [],
		});
		const dad = this.opering;
		this.opering = nBlk;
		cbOri();
		this.opering = dad;
		return nBlk;
	}
	protected condition(expr: Types.Condition) {
		switch (expr.tid) {
			case TypeId.CommandRslt:
				return this.node(NType.ExpressionCommand, {
					pos: expr.index,
				});
			case TypeId.Selected:
				return this.node(NType.ExpressionSelect, {
					expr: expr.expr,
					range: expr.range,
				});
		}
	}
	insert(cmd: string) {
		const nCommand = this.regPath(
			this.node(NType.Command, {
				exec: cmd,
			}),
			this.opering,
		);
		this.opering.nodes.push(nCommand);
		return nCommand.index;
	}
	If(expr: Types.Condition, tdoOri: Vcb, fdoOri: Vcb) {
		const nBranch = this.regPath(
			this.node(NType.Branch),
			this.opering,
		);
		nBranch.expr = this.regPath(
			this.condition(expr),
			nBranch,
		);
		nBranch.tdo = this.regPath(
			this.block(tdoOri),
			nBranch,
		);
		nBranch.fdo = this.regPath(
			this.block(fdoOri),
			nBranch,
		);
		this.opering.nodes.push(nBranch);
		return nBranch.index;
	}
}
