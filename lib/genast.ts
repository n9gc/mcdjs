/**
 * 抽象语法树操作工具模块
 * @module mcdjs/lib/genast
 * @version 0.1.1
 * @license GPL-3.0-or-later
 */
declare module './genast';

import { chCommand, Types } from './alload';
import Vcb = Types.Vcb;

export enum NType {
	CodeBlock,
	Command,
	Exprssion,
	Branch,
}
export interface Node {
	ntype: NType;
	index: number;
	tips?: string;
}
export interface NodeCodeBlock extends Node {
	ntype: NType.CodeBlock;
	nodes: AllNode[];
}
export interface NodeCommand extends Node {
	ntype: NType.Command;
	exec: string;
}
export interface NodeExprssion extends Node {
	ntype: NType.Exprssion;
	netype: NExprssionType;
}
export enum NExprssionType {
	Command,
}
export interface NodeExprssionCommand extends NodeExprssion {
	netype: NExprssionType.Command;
	pos: number;
}
export type AllNodeExprssion =
	| NodeExprssionCommand;
export interface NodeBranch extends Node {
	ntype: NType.Branch;
	expr: AllNodeExprssion;
	tdo: NodeCodeBlock;
	fdo: NodeCodeBlock;
}
export type AllFnNode =
	| NodeCodeBlock
	| AllNodeExprssion
	| NodeBranch
	| NodeCommand;
export type AllNode = AllFnNode | Node;
export type SelNode<T extends NType> = AllFnNode & { ntype: T; };
export type AST = NodeCodeBlock;

export class OperAPI {
	constructor(
		private operm: Operator,
	) {
	}
	If(expr: number, tdoOri: Vcb, fdoOri: Vcb) {
		const nbEx = this.operm.node(NType.Exprssion, {
			netype: NExprssionType.Command,
			pos: expr,
		});
		const tdo = this.operm.getBlock(tdoOri);
		const fdo = this.operm.getBlock(fdoOri);
		const nBranch = this.operm.node(NType.Branch, {
			expr: nbEx,
			tdo,
			fdo,
		});
		this.operm.operingBlock.nodes.push(nBranch);
		return nBranch.index;
	}
}

export class Operator {
	constructor(tips: string) {
		this.nodeList = [
			this.operingBlock = this.ast = {
				ntype: NType.CodeBlock,
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
	node<T extends NType>(ntype: T, body: Omit<SelNode<T>, 'index' | 'tips' | 'ntype'>) {
		const rslt = body as SelNode<T>;
		rslt.ntype = ntype;
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
	operingBlock: NodeCodeBlock;
	ast: AST;
	nodeList: AllNode[];
	api: OperAPI;
}

