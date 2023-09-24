/**
 * 抽象语法树节点类型定义模块
 * @module mcdjs/lib/magast/nodes
 * @version 2.0.1
 * @license GPL-2.0-or-later
 */
declare module './nodes';
declare global {
	namespace McdJSPort {
		namespace Node {
			export import Top = Internal.Top;
			export import System = Internal.System;
		}
	}
}

import 'reflect-metadata';
import { Obj as LangObj, regEnum } from '../config/text';
import { EType, throwErr } from '../errlib';
import { Port } from '../gload';
import { Enum } from '../types/base';
import type { KeyArrayOf } from '../types/tool';
import type Operator from './operator';

export interface NodeBase {
	ntype: NType;
	index: number;
	tips?: string;
}
export abstract class Base implements NodeBase {
	static readonly nodeAttr: string[] = [];
	static readonly langObj: LangObj | string = '未知节点';
	constructor(operm: Operator, getTip = true) {
		this.index = operm.plusNodeNum();
		if (getTip) {
			const tips = operm.api.getTip();
			if (tips) this.tips = tips;
		}
	}
	abstract readonly ntype: NType;
	readonly index: number;
	tips?: string;
}
export function isNode(n: any): n is Node {
	return n instanceof Base;
}
export type NodeConstructor = typeof Base & (new (...args: any[]) => Base);
export function isNodeConstructor(nodeConstructor: any): nodeConstructor is NodeConstructor {
	return typeof nodeConstructor === 'function' && isNode(nodeConstructor.prototype);
}
export function NodeAttr(proto: Base, key: string) {
	let nodeAttr: string[];
	Reflect.hasMetadata('nodeAttr', proto)
		? nodeAttr = Reflect.getMetadata('nodeAttr', proto)
		: Reflect.defineMetadata('nodeAttr', nodeAttr = [], proto);
	nodeAttr.push(key);
}
namespace Internal {
	export class Top extends Base {
		ntype = NType.Top;
		static readonly 'zh-CN' = '树顶空位';
		constructor(operm: Operator, system: System) {
			super(operm);
			this.system = system;
		}
		@NodeAttr readonly system: System;
	}
	export class System extends Base {
		ntype = NType.System;
		static readonly 'zh-CN' = '指令系统';
		constructor(
			operm: Operator,
			public readonly tips: string,
		) { super(operm); }
		@NodeAttr readonly nodes: Node[] = [];
	}
}

export type NTypeObj = Enum.From<KeyArrayOf<typeof McdJSPort.Node>>;
export const NType = {} as NTypeObj;
type NTypeStrKey = Enum.KeyOf<NTypeObj>;
export type NType<T extends NTypeStrKey = NTypeStrKey> = Enum.ValueOf<NTypeObj, T>;
export type NTypeKey<V extends NType = NType> = Enum.KeyOf<NTypeObj, V>;
export type Node<T extends NType = NType> = InstanceType<(typeof McdJSPort.Node)[NTypeKey<T>]>;
export type Ast = McdJSPort.Node.System;
// export type GotSelNode<T extends NType = NType> = Exclude<Node<T>, 'index'>;
export const tranumNType = regEnum('NType', NType);

let nodeCount = 0;
Port.Node = new Proxy<{ [x: keyof any]: new (...args: any[]) => Base; }>(Internal, {
	set(Nodes, nodeName, nodeConstructor) {
		if (!isNodeConstructor(nodeConstructor)) throwErr(EType.ErrIllegalParameter, Error('应为构造函数'), [nodeConstructor]);
		Nodes[nodeName] = nodeConstructor;
		(<any>NType)[(<any>NType)[nodeName] = nodeCount] = nodeName;
		tranumNType.addTranObj({ [nodeName]: nodeConstructor.langObj });
		nodeCount++;
		return true;
	}
}) as any;

Object.assign(Port.Node, Internal);

export import Node = McdJSPort.Node;