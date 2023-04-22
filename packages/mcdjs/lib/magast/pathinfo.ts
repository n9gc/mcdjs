/**
 * 访问器路径对象定义模块
 * @module mcdjs/lib/magast/pathinfo
 * @version 1.0.2
 * @license GPL-3.0-or-later
 */
declare module './pathinfo';

import { EType, getTracker, holdErr } from '@mcdjs/base/dist/errlib';
import type {
	GotSelNode,
	InitedNodeAttr,
	NType,
	Node,
	SelNode,
} from '@mcdjs/base/dist/types/nodes';
import Operator from './operator';


export default class PathInfo<T extends NType = any, D extends NType = any> {
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
