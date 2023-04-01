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
	ntype: NType;
	index: number;
	tips?: string;
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
export type AllFnNode =
	| NodeSystem
	| NodeCodeBlock
	| NodeExpressionCommand
	| NodeExpressionSelect
	| NodeBranch
	| NodeCommand;
export type AllNode = AllFnNode | Node;
export type SelNode<T extends NType> = AllFnNode & { ntype: T; };
export type AST = NodeSystem;

export class OperAPI {
	constructor(
		private operm: Operator,
	) {
	}
	private ConditionSplit(expr: Types.Condition) {
		switch (expr.tid) {
			case TypeId.CommandRslt:
				return this.operm.node(NType.ExpressionCommand, {
					pos: expr.index,
				});
			case TypeId.Selected:
				return this.operm.node(NType.ExpressionSelect, {
					expr: expr.expr,
					range: expr.range,
				});
		}
	}
	If(expr: Types.Condition, tdoOri: Vcb, fdoOri: Vcb) {
		const nBranch = this.operm.node(NType.Branch);
		nBranch.expr = this.ConditionSplit(expr);
		nBranch.tdo = this.operm.getBlock(tdoOri);
		nBranch.fdo = this.operm.getBlock(fdoOri);
		this.operm.operingBlock.nodes.push(nBranch);
		return nBranch.index;
	}
}

export class Operator {
	constructor(tips: string) {
		this.nodeList = [
			this.operingBlock = this.ast = {
				ntype: NType.System,
				nodes: [],
				tips,
				index: 0,
			},
		];
		this.api = new OperAPI(this);
	}
	come() {
		chCommand.come(this);
		return this;
	}
	exit() {
		chCommand.exit();
		return this;
	}
	node<T extends NType>(ntype: T): SelNode<T>;
	node<T extends NType>(
		ntype: T,
		body: Omit<SelNode<T>, 'index' | 'tips' | 'ntype'>,
	): SelNode<T>;
	node<T extends NType>(
		ntype: T,
		body: Partial<Omit<SelNode<T>, 'index' | 'tips' | 'ntype'>>,
		init: true,
	): SelNode<T>;
	node(ntype: NType, body = {}) {
		const rslt = body as AllNode;
		rslt.ntype = ntype;
		const tips = Temp.tip.getTip();
		tips && (rslt.tips = tips);
		rslt.index = this.nodeList.push(rslt) - 1;
		return rslt;
	}
	insert(cmd: string) {
		const nCommand = this.node(NType.Command, {
			exec: cmd,
		});
		this.operingBlock.nodes.push(nCommand);
		return nCommand.index;
	}
	getBlock(cbOri: Vcb) {
		const nBlk = this.node(NType.CodeBlock, {
			nodes: [],
		});
		const dad = this.operingBlock;
		this.operingBlock = nBlk;
		cbOri();
		this.operingBlock = dad;
		return nBlk;
	}
	operingBlock: NodeCodeBlock | NodeSystem;
	ast: AST;
	nodeList: AllNode[];
	api: OperAPI;
}

