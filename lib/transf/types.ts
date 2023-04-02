/**
 * 转译相关定义模块
 * @module mcdjs/lib/transf/types
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
declare module './types';

import type { Node, NTypeKey } from '../genast';

export class PathInfo {
	constructor(
		public parent: Node,
		public current: Node,
	) {
	}
}
export interface VistorFn {
	(pathInfo: PathInfo): void;
}
export interface VistorObj {
	entry?: VistorFn;
	exit?: VistorFn;
}
export type Vistor = VistorObj | VistorFn;
type InterOfUnion<N> = (N extends N ? (n: N) => 0 : 0) extends (n: infer K) => 0 ? K : never;
type OneOfUnion<N> = InterOfUnion<N extends N ? () => N : 0> extends () => infer K ? K : N;
type EachOfUnion<N, R extends any[] = []> = [N] extends [never] ? R : OneOfUnion<N> extends infer K ? EachOfUnion<Exclude<N, K>, [...R, K]> : [];
type UniqueItems<L extends any[], B extends any[] = []> = L extends [infer S, ...infer K] ? [S, ...UniqueItems<[...B, ...K]>] | UniqueItems<K, [S, ...B]> : [];
type Joined<S extends any[], R extends string = ''> = S extends [infer I extends string, ...infer S extends [any, ...any[]]] ? Joined<S, `${R}${I}|`> : `${R}${S[0]}`;
export type VistorName =
	Joined<Exclude<UniqueItems<EachOfUnion<NTypeKey>>, []>> | 'all';
	// string;
export type TransfModule = {
	[I in VistorName]?: Vistor;
}
