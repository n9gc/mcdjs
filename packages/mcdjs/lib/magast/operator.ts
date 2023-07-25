/**
 * 抽象语法树操作器定义模块
 * @module mcdjs/lib/magast/operator
 * @version 2.2.3
 * @license GPL-2.0-or-later
 */
declare module './operator';

import { chCommand } from '../cmdobj';
import Metcls from './metcls';
import * as Types from './nodes';
import {
	AST,
	Node,
} from './nodes';
import PathInfo from './pathinfo';
import { Plugin, PluginEmiter } from './transf';

export default class Operator extends Metcls {
	constructor(tips: string) {
		super();
		this.top = new Node.Top(this,
			this.scope = this.ast = new Node.System(this, tips)
		);
	}
	override readonly operm = this;
	scope: Node.CodeBlock | Node.System;
	readonly ast: AST;
	protected readonly top: Node.Top;
	protected nodeNum = 0;
	plusNodeNum() {
		return this.nodeNum++;
	}
	come() {
		chCommand.come(this);
		return this;
	}
	exit() {
		chCommand.exit();
		return this;
	}
	push(node: Node) {
		this.scope.nodes.push(node);
		return node.index;
	}
	override walk(emiter: Plugin | PluginEmiter) {
		new PathInfo(
			this, this.ast, this.top,
			false, 0,
			'system',
		).walk(emiter);
	}
}
