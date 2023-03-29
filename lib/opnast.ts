/**
 * 抽象语法树操作工具模块
 * @module mcdjs/lib/opnast
 * @version 0.1.1
 * @license GPL-3.0-or-later
 */
declare module './opnast';

import { chCommand } from './cmdobj';
import { Types } from './struct';

export enum NType {
	CodeBlock,
	Command,
}
export interface Node {
	ntype: NType;
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
export type AllNode =
	| NodeCodeBlock
	| NodeCommand
	| Node;
export type AST = NodeCodeBlock;

export class Operator {
	constructor(tips: string) {
		this.operingBlock = this.ast = {
			ntype: NType.CodeBlock,
			nodes: [],
			tips,
		};
	}
	come() {
		chCommand.come(this);
		return this;
	}
	exit() {
		chCommand.exit();
		return this;
	}
	insert(cmd: string) {
		this.operingBlock.nodes.push({ ntype: NType.Command, exec: cmd });
	}
	operingBlock: NodeCodeBlock;
	ast: AST;
}

