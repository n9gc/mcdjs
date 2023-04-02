/**
 * 抽象语法树操作工具模块
 * @module mcdjs/lib/genast
 * @version 0.1.3
 * @license GPL-3.0-or-later
 */
declare module './genast';

import Temp, { chCommand, Types } from './alload';
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
export interface Node {
	tips?: string;
}
export class Node {
	constructor(
		public ntype: NType,
		operm: Operator,
		dadNode: Node,
		n: Partial<AllNode> | null = null,
		tips: string | null = null,
	) {
		Object.assign(this, n);
		this.#operm = operm;
		this.index = operm.nodeList.push(this) - 1;
		tips && (this.tips = tips);
		this.setDad(dadNode);
	}
	setDad(dadNode: Node) {
		this.#dad = dadNode;
		this.#operm.rel[this.index] = this.#dad;
	}
	getDad() {
		return this.#dad;
	}
	index: number;
	#dad!: Node;
	#operm: Operator;
}
export type InitedNodeAttr =
	| 'setDad'
	| 'getDad'
	| 'dad'
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

export class OperAPI {
	constructor(
		private operm: Operator,
	) {
	}
	private ConditionSplit(expr: Types.Condition, dadNode: Node) {
		switch (expr.tid) {
			case TypeId.CommandRslt:
				return this.operm.node(NType.ExpressionCommand, dadNode, {
					pos: expr.index,
				});
			case TypeId.Selected:
				return this.operm.node(NType.ExpressionSelect, dadNode, {
					expr: expr.expr,
					range: expr.range,
				});
		}
	}
	If(expr: Types.Condition, tdoOri: Vcb, fdoOri: Vcb) {
		const { operm, operm: { opering } } = this;
		const nBranch = operm.node(NType.Branch, opering);
		nBranch.expr = this.ConditionSplit(expr, nBranch);
		nBranch.tdo = operm.getBlock(tdoOri, nBranch);
		nBranch.fdo = operm.getBlock(fdoOri, nBranch);
		opering.nodes.push(nBranch);
		return nBranch.index;
	}
}

export class Operator {
	constructor(tips: string) {
		this.nodeList.push(this.opering = this.ast = this.node(
			NType.System,
			null as any,
			{ nodes: [], tips },
		));
		this.api = new OperAPI(this);
	}
	opering: NodeCodeBlock | NodeSystem;
	ast: AST;
	api: OperAPI;
	nodeList: Node[] = [];
	rel: { [index: number]: Node; } = {};
	come() {
		chCommand.come(this);
		return this;
	}
	exit() {
		chCommand.exit();
		return this;
	}
	node<T extends NType>(ntype: T, dadNode: Node): SelNode<T>;
	node<T extends NType>(ntype: T, dadNode: Node, body: Omit<SelNode<T>, InitedNodeAttr>): SelNode<T>;
	node<T extends NType>(ntype: T, dadNode: Node, body: Partial<Omit<SelNode<T>, InitedNodeAttr>>, init: true): SelNode<T>;
	node(ntype: NType, dadNode: Node, body: any = null) {
		return new Node(
			ntype,
			this,
			dadNode,
			body,
			Temp.tip.getTip(),
		);
	}
	insert(cmd: string) {
		const nCommand = this.node(NType.Command, this.opering, {
			exec: cmd,
		});
		this.opering.nodes.push(nCommand);
		return nCommand.index;
	}
	getBlock(cbOri: Vcb, dadNode: Node = this.opering) {
		const nBlk = this.node(NType.CodeBlock, dadNode, {
			nodes: [],
		});
		const dad = this.opering;
		this.opering = nBlk;
		cbOri();
		this.opering = dad;
		return nBlk;
	}
}

