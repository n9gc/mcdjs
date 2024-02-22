/**
 * 访问器路径对象定义模块
 * @module mcdjs/lib/magast/pathinfo
 * @version 2.5.1
 * @license GPL-2.0-or-later
 */
declare module './pathinfo';
import 'reflect-metadata';
import Metcls from './metcls';
import type { NType, Node } from './nodes';
import type Operator from './operator';
import { Plugin, PluginEmiter } from './transf';
export interface Asserts {
    dad: NType;
    inList: boolean;
}
export default class PathInfo<T extends NType = NType, A extends Asserts = Asserts> extends Metcls {
    node: Node<T>;
    dad: Node<A['dad']>;
    protected inList: boolean;
    listIndex: number;
    constructor(operm: Operator, node: Node<T>, dad: Node<A['dad']>, inList: boolean, listIndex: number, dadKey: string);
    readonly operm: Operator;
    readonly dadKey: keyof Node<A['dad']>;
    readonly listIn: Node[] | null;
    isInList(): this is PathInfo<T, A & {
        inList: true;
    }>;
    isNotInList(): this is PathInfo<T, A & {
        inList: false;
    }>;
    sure<K extends NType>(ntype: K): this is PathInfo<K, A>;
    notSure<K extends NType>(ntype: K): this is PathInfo<Exclude<T, K>, A>;
    sureDad<K extends NType>(ntype: K): this is PathInfo<T, A & {
        dad: K;
    }>;
    notSureDad<K extends NType>(ntype: K): this is PathInfo<T, A & {
        dad: Exclude<A['dad'], K>;
    }>;
    private removed;
    remove(): void;
    private walkEmiter;
    walk(emiter: Plugin | PluginEmiter): void;
    stop(): void;
}
