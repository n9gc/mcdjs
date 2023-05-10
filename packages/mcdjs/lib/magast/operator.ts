/**
 * 抽象语法树操作器定义模块
 * @module mcdjs/lib/magast/operator
 * @version 2.1.0
 * @license GPL-3.0-or-later
 */
declare module './operator';

import { chCommand } from '../cmdobj';
import { Shifted } from '../types/tool';
import {
	NType,
	AST,
	NTypeKey,
	Node
} from './nodes';
import * as Types from './nodes';

export default class Operator {
	constructor(tips: string) {
		this.scope = this.ast = new Node.System(this, tips);
	}
	info: { [num: number]: null; } = {};
	scope: Node.CodeBlock | Node.System;
	ast: AST;
	nodeNum = 0;
	Types = Types;
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
	getCls<T extends NTypeKey>(name: T, ...args: Shifted<ConstructorParameters<typeof Node[T]>>): Node<NType<T>> {
		const cls = Node[name] as new (operm: Operator, ...n: typeof args) => any;
		return new cls(this, ...args);
	}
}
