/**
 * 转译模块
 * @module mcdjs/lib/transf
 * @version 1.1.1
 * @license GPL-3.0-or-later
 */
declare module '.';

import {
	AllNode,
	NType,
	NodeExpression,
	Operator,
	PathInfo,
	SelNode,
} from '../magast';
import internalCmd2cb from './internal-cmd2cb';
import internalCond from './internal-cond';
import {
	TransfModule,
	Visitor,
	VisitorFn,
	VisitorObj,
	getNodesVisited,
} from './types';

export const modules = [
	internalCmd2cb,
	internalCond,
];
class VisitorFns {
	entrys: VisitorFn[] = [];
	exits: VisitorFn[] = [];
	add({ entry, exit }: VisitorObj) {
		entry && this.entrys.push(entry);
		exit && this.entrys.push(exit);
	}
}
export class StdedModule {
	constructor(mod: TransfModule) {
		for (const name in mod) {
			const now = (mod as any)[name] as Visitor;
			const obj = typeof now === 'function' ? { entry: now } : now;
			getNodesVisited(name).forEach(n => this.addMap(n, obj));
		}
	}
	protected map: { [I in NType]?: VisitorFns } = {};
	protected addMap(n: NType, obj: VisitorObj) {
		(this.map[n] || (this.map[n] = new VisitorFns())).add(obj);
	}
	entry(n: NType, pathInfo: PathInfo) {
		this.map[n]?.entrys?.forEach(fn => fn(pathInfo));
	}
	exit(n: NType, pathInfo: PathInfo) {
		this.map[n]?.exits?.forEach(fn => fn(pathInfo));
	}
}
type TraverseObjType = {
	[I in NType]: (node: SelNode<I>) => void;
};
export class TraverseObj implements TraverseObjType {
	constructor(
		private mod: StdedModule,
		private operm: Operator,
	) {
		this.do(operm.ast);
	}
	[NType.SystemDad](node: SelNode<NType.SystemDad>) {
		this.do(node.system);
	}
	[NType.System](node: SelNode<NType.System>) {
		this.dos(node.nodes);
	};
	[NType.CodeBlock](node: SelNode<NType.CodeBlock>) {
		this.dos(node.nodes);
	};
	[NType.Command](node: SelNode<NType.Command>) { };
	[NType.ConditionCommand](node: SelNode<NType.ConditionCommand>) { };
	[NType.ConditionSelector](node: SelNode<NType.ConditionSelector>) { };
	[NType.Branch](node: SelNode<NType.Branch>) {
		this.do(node.expr);
		this.do(node.tdo);
		this.do(node.fdo);
	}
	[NType.Block](node: SelNode<NType.Block>) { };
	Expression(node: NodeExpression) {
		if ('ntype' in node.oFirst) this.do(node.oFirst);
		if ('oSecond' in node && 'ntype' in node.oSecond) this.do(node.oSecond);
	}
	[NType.ExpressionAnd] = this.Expression;
	[NType.ExpressionOr] = this.Expression;
	[NType.ExpressionNot] = this.Expression;
	[NType.ExpressionNand] = this.Expression;
	[NType.ExpressionNor] = this.Expression;
	[NType.ExpressionXor] = this.Expression;
	[NType.ExpressionXnor] = this.Expression;
	protected do<T extends NType>(node: SelNode<T>) {
		const type: T = node.ntype;
		const pathInfo = this.operm.paths[node.index];
		this.mod.entry(type, pathInfo);
		(this as TraverseObjType)[type](node);
		this.mod.exit(type, pathInfo);
	}
	protected dos(nodes: AllNode[]) {
		return nodes.forEach(n => this.do(n));
	}
}
export const stdeds = modules.map(mod => new StdedModule(mod));
export default function transform(operm: Operator) {
	stdeds.forEach(mod => new TraverseObj(mod, operm));
}
