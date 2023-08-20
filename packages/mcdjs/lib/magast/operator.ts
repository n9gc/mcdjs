/**
 * 抽象语法树操作器定义模块
 * @module mcdjs/lib/magast/operator
 * @version 2.3.0
 * @license GPL-2.0-or-later
 */
declare module './operator';

import Metcls from './metcls';
import {
	AST,
	Node,
} from './nodes';
import PathInfo from './pathinfo';
import { Plugin, PluginEmiter } from './transf';
import getApi from '../api';

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
	readonly api = getApi(this);
	plusNodeNum() {
		return this.nodeNum++;
	}
	push(node: Node) {
		this.scope.nodes.push(node);
		return new this.api.CommandRsltClass(node.index);
	}
	override walk(emiter: Plugin | PluginEmiter) {
		new PathInfo(
			this, this.ast, this.top,
			false, 0,
			'system',
		).walk(emiter);
	}
	protected plugins = new PluginEmiter();
	// addPlugin(emiter: Plugin | PluginEmiter) {
	// 	this.plugins.merge(emiter);
	// }
	// emitPlugin() {
	// 	this.walk(this.plugins);
	// }
}