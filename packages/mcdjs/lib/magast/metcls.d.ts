/**
 * 与操作器绑定的各种实用函数类
 * @module mcdjs/lib/magast/metcls
 * @version 1.0.2
 * @license GPL-2.0-or-later
 */
declare module './metcls';
import type { Shifted } from "../types/tool";
import { NType, NTypeKey, Node } from "./nodes";
import type Operator from "./operator";
import type { Plugin, PluginEmiter } from "./transf";
export default abstract class Metcls {
    abstract readonly operm: Operator;
    getNode<T extends NTypeKey>(name: T, ...args: Shifted<ConstructorParameters<typeof Node[T]>>): Node<NType<T>>;
    abstract walk(emiter: Plugin | PluginEmiter): void;
}
