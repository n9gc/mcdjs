/**
 * 访问器路径对象定义模块
 * @module mcdjs/lib/magast/pathinfo
 * @version 2.3.0
 * @license GPL-2.0-or-later
 */
declare module './pathinfo';

import 'reflect-metadata';
import { InArr } from '../types/tool';
import Metcls from './metcls';
import { NType, NTypeObj, Node } from './nodes';
import Operator from './operator';
import { Plugin, PluginEmiter } from './transf';

export interface Asserts {
	dad: NType;
	inList: boolean;
}
export default class PathInfo<T extends NType = NType, A extends Asserts = Asserts> extends Metcls {
	constructor(
		operm: Operator,
		public node: Node<T>,
		public dad: Node<A['dad']>,
		public inList: A['inList'],
		public listIndex: number,
		public dadKey: InArr<typeof Node[NTypeObj[A['dad']]]['nodeAttr']>,
	) {
		super();
		this.operm = operm;
		this.listIn = inList ? (dad as any)[dadKey] : null;
	}
	override operm;
	listIn: Node[] | null;
	sureDad<K extends NType>(ntype: K): this is PathInfo<T, A & { dad: K; }> {
		return ntype === this.dad?.ntype;
	}
	private walkEmiter(emiter: PluginEmiter) {
		emiter.entry(this);
		for (const attrName of Reflect.getMetadata('nodeAttr', this.node) || []) {
			let attr: Node | Node[] | null = (<any>this.node)[attrName];
			if (attr === null) continue;
			let idx, inList = true;
			if (!attr) console.log(attrName, this.node);
			if (!('length' in attr)) attr = [attr], inList = false;
			else attr = attr.slice(0);
			for (idx = 0; idx < attr.length; ++idx)
				new PathInfo(
					this.operm, attr[idx], this.node,
					inList, idx,
					attrName,
				).walkEmiter(emiter);
		}
		emiter.exit(this);
	}
	override walk(emiter: Plugin | PluginEmiter) {
		this.walkEmiter(new PluginEmiter(emiter));
	}
	/*
	replace<N extends NType>(n: GotSelNode<N>, tips?: string) {
		const npi: PathInfo<N, D> = this as any;
		n.endTimer();
		npi.node = n;
		n.index = npi.node.index;
		npi.listIn ? npi.listIn[npi.posInList] = n : (npi.parent[npi.key] as any) = n;
		return npi;
	}
	*/
}
