/**
 * 抽象语法树操作工具模块
 * @module mcdjs/lib/magast
 * @version 0.1.5
 * @license GPL-3.0-or-later
 */
declare module './magast';

import Temp, { chCommand, Types } from './alload';
import { Text } from './config';
import { EType, getTracker, holdErr } from './errlib';
import Vcb = Types.Vcb;
import TypeId = Types.TypeId;

export enum NType {
	SystemDad = -1,
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
	[NType.SystemDad]: {
		'zh-CN': '指令系统的父节点',
	},
	[NType.System]: {
		'zh-CN': '指令系统',
	},
	[NType.CodeBlock]: {
		'zh-CN': '代码块',
	},
	[NType.Command]: {
		'zh-CN': '单命令',
	},
	[NType.ConditionCommand]: {
		'zh-CN': '有条件命令方块',
	},
	[NType.ConditionSelector]: {
		'zh-CN': '选择器',
	},
	[NType.Branch]: {
		'zh-CN': '条件分支',
	},
	[NType.Block]: {
		'zh-CN': '命令方块',
	},
	[NType.ExpressionAnd]: {
		'zh-CN': '与表达式',
	},
	[NType.ExpressionOr]: {
		'zh-CN': '或表达式',
	},
	[NType.ExpressionNot]: {
		'zh-CN': '非表达式',
	},
	[NType.ExpressionNand]: {
		'zh-CN': '与非表达式',
	},
	[NType.ExpressionNor]: {
		'zh-CN': '或非表达式',
	},
	[NType.ExpressionXor]: {
		'zh-CN': '异或表达式',
	},
	[NType.ExpressionXnor]: {
		'zh-CN': '同或表达式',
	},
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
export class PathInfo<T extends NType = any, D extends NType = any> {
	constructor(
		public operm: Operator,
		public node: SelNode<T>,
		parent: Partial<SelNode<D>>,
		public key: Exclude<keyof SelNode<D>, keyof Node>,
	) {
		this.parent = parent as SelNode<D>;
		const pk = (parent as any)[key];
		if (this.inList = Array.isArray(pk)) {
			this.posInList = (this.listIn = pk).push(node) - 1;
		} else {
			this.posInList = -1;
			(parent as any)[key] = node;
			this.listIn = null;
		}
		node.endTimer?.();
		operm.paths[node.index] = this;
	}
	parent: SelNode<D>;
	posInList: number;
	inList: boolean;
	listIn: Node[] | null;
	replace<N extends NType>(n: GotSelNode<N>, tips?: string) {
		const npi: PathInfo<N, D> = this as any;
		n.endTimer();
		npi.node = n;
		n.index = npi.node.index;
		npi.listIn ? npi.listIn[npi.posInList] = n : (npi.parent[npi.key] as any) = n;
		return npi;
	}
	getNode<N extends NType>(ntype: N): GotSelNode<N>;
	getNode<N extends NType>(ntype: N, body: Omit<SelNode<N>, InitedNodeAttr>): GotSelNode<N>;
	getNode<N extends NType>(ntype: N, body: Partial<Omit<SelNode<N>, InitedNodeAttr>>, init: true): GotSelNode<N>;
	getNode(ntype: NType, body: any = {}) {
		const node = body as GotSelNode;
		node.ntype = ntype;
		node.endTimer = holdErr(EType.ErrForgetPathInfo, getTracker(), node);
		return node;
	}
}

export class Operator {
	constructor(tips: string) {
		this.opering = this.ast = this.regPath(
			this.node(
				NType.System,
				{ nodes: [], tips },
			),
			{ ntype: NType.SystemDad, index: -1 },
			'system',
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
	node<T extends NType>(ntype: T): SelNode<T>;
	node<T extends NType>(ntype: T, body: Omit<SelNode<T>, InitedNodeAttr>): SelNode<T>;
	node<T extends NType>(ntype: T, body: Partial<Omit<SelNode<T>, InitedNodeAttr>>, init: true): SelNode<T>;
	node(ntype: NType, body: any = {}) {
		const node = body as Node;
		node.ntype = ntype;
		node.index = this.nodeNum++;
		node.endTimer = holdErr(EType.ErrForgetPathInfo, getTracker(), node);
		const tips = Temp.tip.getTip();
		tips && (node.tips = tips);
		return node;
	}
	regPath<T extends NType, D extends NType>(...args: Types.Shifted<ConstructorParameters<typeof PathInfo<T, D>>>) {
		new PathInfo(this, ...args);
		return args[0];
	}
	block(cbOri: Vcb) {
		const nBlk = this.node(NType.CodeBlock, {
			nodes: [],
		});
		const dad = this.opering;
		this.opering = nBlk;
		cbOri();
		this.opering = dad;
		return nBlk;
	}
	condition(expr: Types.Condition) {
		switch (expr.tid) {
			case TypeId.CommandRslt:
				return this.node(NType.ConditionCommand, {
					pos: expr.index,
				});
			case TypeId.Selected:
				return this.node(NType.ConditionSelector, {
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
			'nodes',
		);
		return nCommand.index;
	}
	If(expr: Types.Condition, tdoOri: Vcb, fdoOri: Vcb) {
		const nBranch = this.regPath(
			this.node(NType.Branch),
			this.opering,
			'nodes',
		);
		this.regPath(
			this.condition(expr),
			nBranch,
			'expr',
		);
		this.regPath(
			this.block(tdoOri),
			nBranch,
			'tdo',
		);
		this.regPath(
			this.block(fdoOri),
			nBranch,
			'fdo',
		);
		return nBranch.index;
	}
}
