/**
 * 抽象语法树操作器定义模块
 * @module mcdjs/lib/magast/operator
 * @version 2.3.1
 * @license GPL-2.0-or-later
 */
declare module './operator';
import Metcls from './metcls';
import { Ast, Node } from './nodes';
import { Plugin, PluginEmiter } from './transf';
export default class Operator extends Metcls {
    constructor(tips: string);
    readonly operm: this;
    scope: Node.CodeBlock | Node.System;
    readonly ast: Ast;
    protected readonly top: Node.Top;
    protected nodeNum: number;
    readonly api: import("../api").Api;
    plusNodeNum(): number;
    push(node: Node): import("../api/static").CommandRsltClass;
    walk(emiter: Plugin | PluginEmiter): void;
    protected plugins: PluginEmiter;
}
