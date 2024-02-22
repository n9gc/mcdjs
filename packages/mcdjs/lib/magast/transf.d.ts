/**
 * 转译相关定义模块
 * @module mcdjs/lib/magast/transf
 * @version 2.3.1
 * @license GPL-2.0-or-later
 */
declare module './transf';
import { ArrayMap } from '../types/base';
import type { InArr } from '../types/tool';
import { NType, NTypeKey } from './nodes';
import type PathInfo from './pathinfo';
declare namespace Alias {
    const expressionCalcSig: readonly [9];
    const expressionCalcBin: readonly [7, 10, 11, 8, 13, 12];
    const expressionCalc: readonly [7, 10, 11, 8, 13, 12, 9];
    const expression: readonly [7, 10, 11, 8, 13, 12, 9, 6, 5];
}
export type Alias = keyof typeof Alias;
export type VisitedNType<T extends VisitorName> = T extends NTypeKey ? NType<T> : T extends Alias ? InArr<typeof Alias[T]> : NType;
export declare function getNodesVisited(name: string): readonly [9] | readonly [7, 10, 11, 8, 13, 12] | readonly [7, 10, 11, 8, 13, 12, 9] | readonly [7, 10, 11, 8, 13, 12, 9, 6, 5] | (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15)[];
export type VisitorName = NTypeKey | 'all' | Alias;
export interface VisitorFn<T extends NType = NType> {
    (pathInfo: PathInfo<T>): void;
}
export interface VisitorObj<T extends NType = NType> {
    entry?: VisitorFn<T>;
    exit?: VisitorFn<T>;
}
export type Visitor<T extends NType = NType> = VisitorObj<T> | VisitorFn<T>;
export type Plugin = {
    [I in VisitorName]?: Visitor<VisitedNType<I>>;
};
export declare class PluginEmiter {
    static readonly visitorType: readonly ["exit", "entry"];
    constructor(plugin?: Plugin | PluginEmiter);
    protected entryMap: ArrayMap<NType, VisitorFn<NType>>;
    protected exitMap: ArrayMap<NType, VisitorFn<NType>>;
    protected addMap(n: NType, obj: VisitorObj): void;
    protected do(way: 'entry' | 'exit', path: PathInfo<any, any>): void;
    entry(path: PathInfo<any, any>): void;
    exit(path: PathInfo<any, any>): void;
}
export {};
