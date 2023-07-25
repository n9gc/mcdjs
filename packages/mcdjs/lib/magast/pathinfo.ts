/**
 * 访问器路径对象定义模块
 * @module mcdjs/lib/magast/pathinfo
 * @version 2.4.1
 * @license GPL-2.0-or-later
 */
declare module './pathinfo';

import 'reflect-metadata';
import { EType, throwErr } from '../errlib';
import Metcls from './metcls';
import { NType, Node } from './nodes';
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
		protected inList: boolean,
		public listIndex: number,
		dadKey: string,
	) {
		super();
		this.operm = operm;
		this.dadKey = <any>dadKey;
		this.listIn = inList ? (dad as any)[dadKey] : null;
	}
	override readonly operm;
	readonly dadKey: keyof Node<A['dad']>;
	readonly listIn: Node[] | null;
	isInList(): this is PathInfo<T, A & { inList: true; }> {
		return this.inList;
	}
	isNotInList(): this is PathInfo<T, A & { inList: false; }> {
		return this.inList;
	}
	sure<K extends NType>(ntype: K): this is PathInfo<K, A> {
		return ntype === this.node.ntype;
	}
	notSure<K extends NType>(ntype: K): this is PathInfo<Exclude<T, K>, A> {
		return ntype !== this.node.ntype;
	}
	sureDad<K extends NType>(ntype: K): this is PathInfo<T, A & { dad: K; }> {
		return ntype === this.dad?.ntype;
	}
	notSureDad<K extends NType>(ntype: K): this is PathInfo<T, A & { dad: Exclude<A['dad'], K>; }> {
		return ntype === this.dad?.ntype;
	}
	private removed = false;
	remove() {
		if (!this.inList) throwErr(EType.ErrNotInList, Error(), this);
		if (this.removed) return;
		const list = <Node[]>this.dad[this.dadKey];
		list.splice(list.indexOf(this.node), 1);
	}
	private walkEmiter(emiter: PluginEmiter) {
		emiter.entry(this);
		for (const attrName of Reflect.getMetadata('nodeAttr', this.node) || []) {
			let attr: Node | Node[] = (<any>this.node)[attrName];
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
