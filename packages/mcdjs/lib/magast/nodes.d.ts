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
import { Obj as LangObj } from '../config/text';
import { Enum } from '../types/base';
import type { KeyArrayOf } from '../types/tool';
import type Operator from './operator';
export interface NodeBase {
    ntype: NType;
    index: number;
    tips?: string;
}
export declare abstract class Base implements NodeBase {
    static readonly nodeAttr: string[];
    static readonly langObj: LangObj | string;
    constructor(operm: Operator, getTip?: boolean);
    abstract readonly ntype: NType;
    readonly index: number;
    tips?: string;
}
export declare function isNode(n: any): n is Node;
export type NodeConstructor = typeof Base & (new (...args: any[]) => Base);
export declare function isNodeConstructor(nodeConstructor: any): nodeConstructor is NodeConstructor;
export declare function NodeAttr(proto: Base, key: string): void;
declare namespace Internal {
    class Top extends Base {
        ntype: 14;
        static readonly 'zh-CN' = "\u6811\u9876\u7A7A\u4F4D";
        constructor(operm: Operator, system: System);
        readonly system: System;
    }
    class System extends Base {
        readonly tips: string;
        ntype: 15;
        static readonly 'zh-CN' = "\u6307\u4EE4\u7CFB\u7EDF";
        constructor(operm: Operator, tips: string);
        readonly nodes: Node[];
    }
}
export type NTypeObj = Enum.From<KeyArrayOf<typeof McdJSPort.Node>>;
export declare const NType: Readonly<{
    CodeBlock: 0;
} & {
    Command: 1;
} & {
    Branch: 2;
} & {
    CBGroup: 3;
} & {
    NameSpace: 4;
} & {
    CommandRslt: 5;
} & {
    Selector: 6;
} & {
    ExpressionAnd: 7;
} & {
    ExpressionOr: 8;
} & {
    ExpressionNot: 9;
} & {
    ExpressionNand: 10;
} & {
    ExpressionNor: 11;
} & {
    ExpressionXor: 12;
} & {
    ExpressionXnor: 13;
} & {
    Top: 14;
} & {
    System: 15;
} & import("../types/tool").MapOfArray<["CodeBlock", "Command", "Branch", "CBGroup", "NameSpace", "CommandRslt", "Selector", "ExpressionAnd", "ExpressionOr", "ExpressionNot", "ExpressionNand", "ExpressionNor", "ExpressionXor", "ExpressionXnor", "Top", "System"]>>;
type NTypeStrKey = Enum.KeyOf<NTypeObj>;
export type NType<T extends NTypeStrKey = NTypeStrKey> = Enum.ValueOf<NTypeObj, T>;
export type NTypeKey<V extends NType = NType> = Enum.KeyOf<NTypeObj, V>;
export type Node<T extends NType = NType> = InstanceType<(typeof McdJSPort.Node)[NTypeKey<T>]>;
export type Ast = McdJSPort.Node.System;
export declare const tranumNType: import("../config/text").GetTextFn<Readonly<{
    CodeBlock: 0;
} & {
    Command: 1;
} & {
    Branch: 2;
} & {
    CBGroup: 3;
} & {
    NameSpace: 4;
} & {
    CommandRslt: 5;
} & {
    Selector: 6;
} & {
    ExpressionAnd: 7;
} & {
    ExpressionOr: 8;
} & {
    ExpressionNot: 9;
} & {
    ExpressionNand: 10;
} & {
    ExpressionNor: 11;
} & {
    ExpressionXor: 12;
} & {
    ExpressionXnor: 13;
} & {
    Top: 14;
} & {
    System: 15;
} & import("../types/tool").MapOfArray<["CodeBlock", "Command", "Branch", "CBGroup", "NameSpace", "CommandRslt", "Selector", "ExpressionAnd", "ExpressionOr", "ExpressionNot", "ExpressionNand", "ExpressionNor", "ExpressionXor", "ExpressionXnor", "Top", "System"]>>>;
export import Node = McdJSPort.Node;
export {};
