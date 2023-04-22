/**
 * 抽象语法树操作器定义模块
 * @module mcdjs/lib/magast/operator
 * @version 1.0.4
 * @license GPL-3.0-or-later
 */
declare module './operator';

import { EType, getTracker, holdErr } from '@mcdjs/base/dist/errlib';
import { Condition, Shifted, TypeId, Vcb } from '@mcdjs/base/dist/types';
import {
	AST,
	InitedNodeAttr,
	NType,
	Node,
	NodeCodeBlock,
	NodeSystem,
	SelNode,
} from '@mcdjs/base/dist/types/nodes';
import { chCommand } from '../cmdobj';
import { Temp } from '../struct';
import PathInfo from './pathinfo';

export default class Operator {
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
	regPath<T extends NType, D extends NType>(...args: Shifted<ConstructorParameters<typeof PathInfo<T, D>>>) {
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
	condition(expr: Condition) {
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
	If(expr: Condition, tdoOri: Vcb, fdoOri: Vcb) {
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
