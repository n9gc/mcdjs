/**
 * 转译模块
 * @module mcdjs/lib/transf
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module '.';

import { AllNode, NType, Operator, SelNode } from '../genast';
import cond from './cond';
import { PathInfo, TransfModule, Vistor, VistorFn, VistorObj } from './types';

export const modules = [
	cond,
];
class VistorFns {
	entrys: VistorFn[] = [];
	exits: VistorFn[] = [];
	add({ entry, exit }: VistorObj) {
		entry && this.entrys.push(entry);
		exit && this.entrys.push(exit);
	}
}
function isEnum(n: string): n is keyof typeof NType {
	return typeof NType[n as any] === 'number';
}
export class StdedModule {
	constructor(mod: TransfModule) {
		for (const i in mod) {
			const now = (mod as any)[i] as Vistor;
			const obj = typeof now === 'function' ? { entry: now } : now;
			i.split('|').forEach(n => isEnum(n) &&
				(this.map[NType[n]] || (this.map[NType[n]] = new VistorFns())).add(obj)
			);
		}
	}
	protected map: { [I in NType]?: VistorFns } = {};
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
	protected do<T extends NType>(node: SelNode<T>) {
		const type: T = node.ntype;
		const pathInfo = new PathInfo(node.getDad(), node);
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
