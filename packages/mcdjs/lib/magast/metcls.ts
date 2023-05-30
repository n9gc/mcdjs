/**
 * 与操作器绑定的各种实用函数类
 * @module mcdjs/lib/magast/metcls
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './metcls';

import { Shifted } from "../types/tool";
import { NType, NTypeKey, Node } from "./nodes";
import Operator from "./operator";
import { Plugin, PluginEmiter } from "./transf";

export default abstract class Metcls {
	abstract operm: Operator;
	getCls<T extends NTypeKey>(name: T, ...args: Shifted<ConstructorParameters<typeof Node[T]>>): Node<NType<T>> {
		const cls = Node[name] as new (operm: Operator, ...n: typeof args) => any;
		return new cls(this.operm, ...args);
	}
	abstract walk(emiter: Plugin | PluginEmiter): void;
}
