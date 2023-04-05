/**
 * 转译模块
 * @module mcdjs/lib/transf
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
declare module '.';

import {
	AllNode,
	NType,
	Operator,
	PathInfo,
	SelNode,
	eachNType,
	isNType,
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
	[-1](node: SelNode<NType.SystemDad>) {
		this.do(node.system);
	}
	[0](node: SelNode<NType.System>) {
		this.dos(node.nodes);
	};
	[1](node: SelNode<NType.CodeBlock>) {
		this.dos(node.nodes);
	};
	[2](node: SelNode<NType.Command>) { };
	[3](node: SelNode<NType.ExpressionCommand>) { };
	[4](node: SelNode<NType.ExpressionSelect>) { };
	[5](node: SelNode<NType.Branch>) {
		this.do(node.expr);
		this.do(node.tdo);
		this.do(node.fdo);
	}
	[6](node: SelNode<NType.Block>) { };
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
