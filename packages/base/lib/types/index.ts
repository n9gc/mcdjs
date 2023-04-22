/**
 * 类型定义模块
 * @module @mcdjs/base/lib/types
 * @version 1.3.2
 * @license GPL-3.0-or-later
 */
declare module '.';

import { Text } from '../config';
import { AST } from './nodes';

export * as errors from './errors';
export * as nodes from './nodes';
export * as transf from './transf';

export type Vcb = () => void;
export type BInT<T, B> = T extends B ? T : never;
export type Exted<C extends D, D> = C;
export type Ased<N, T> = T extends Exted<infer T, N> ? T : never;
export type AnyArr<T = any> = readonly T[];
export type WideNum = number | bigint;
export type MayNum = WideNum | string;
export type Tostrable = boolean | MayNum | null | undefined;
export type EqualTo<A, B> = (<F>() => F extends A ? 1 : 0) extends (<F>() => F extends B ? 1 : 0) ? true : false;
export type InterOfUnion<N> = (N extends N ? (n: N) => 0 : 0) extends (n: infer K) => 0 ? K : never;
type OneOfUnion<N> = InterOfUnion<N extends N ? () => N : 0> extends () => infer K ? K : N;
export type EachOfUnion<
	N,
	R extends any[] = []>
	= ([N] extends [never]
		? R
		: (OneOfUnion<N> extends infer K
			? EachOfUnion<Exclude<N, K>, [...R, K]>
			: []
		)
	);
export type UniqueItems<
	L extends any[],
	R extends any[] = []>
	= (L extends [infer S, ...infer K]
		? [S, ...UniqueItems<[...R, ...K]>] | UniqueItems<K, [S, ...R]>
		: []
	);
export type Joined<
	S extends Tostrable[],
	F extends Tostrable,
	R extends string = ''>
	= (S extends [infer I extends Tostrable, ...infer S extends [any, ...any[]]]
		? Joined<S, F, `${R}${I}${F}`>
		: `${R}${S[0]}`
	);
export interface Enum {
	[key: number | string]: number | string;
}
export namespace Enum {
	export type KeyOf<B extends Enum> = B extends B ? BInT<keyof B, string> : never;
	export type ValueOf<B extends Enum> = Ased<number, B extends B ? B[KeyOf<B>] : never>;
}
export type Shifted<T extends AnyArr> = T extends readonly [any, ...infer T] ? T : T;
export enum TypeId {
	CommandRslt,
	Selected,
	SimTag,
}
export const tranumTypeId = Text.regEnum('TypeId', TypeId, {
	CommandRslt: '命令结果表示',
	Selected: '选择器表示',
	SimTag: '标签表示',
});
export enum CbType {
	Impulse,
	Chain,
	Repeat,
}
export const tranumCbType = Text.regEnum('CbType', CbType, {
	Impulse: '脉冲',
	Chain: '链式',
	Repeat: '重复',
});
export interface RoundParsed extends Array<AST> {
}
export interface CommandRslt {
	index: number;
	tid: TypeId.CommandRslt;
}
export namespace Sim {
	export interface Base {
		tid: TypeId;
		name: string;
	}
	export interface Tag extends Base {
		toString(): string;
		tid: TypeId.SimTag;
	}
}
export import SimTag = Sim.Tag;
export namespace Expression {
	export type OperatorSig =
		| '!'
		| 'not'
		;
	export type OperatorBin =
		| '&'
		| 'and'
		| '|'
		| 'or'
		| 'nand'
		| 'nor'
		| 'xor'
		| 'xnor'
		;
	export type Operator =
		| OperatorBin
		| OperatorSig
		;
	export type Calcable =
		| Sub
		| SimTag
		;
	export type SubSig = [OperatorSig, Calcable];
	export type SubBin = [Calcable, OperatorBin, Calcable];
	export type Sub =
		| SubSig
		| SubBin
		;
	export type Any = null | Calcable;
}
export import Expression = Expression.Any;
export namespace Select {
	export interface Obj {
		expr: Expression;
		range: At;
		tid: TypeId.Selected;
	}
	export type At =
		| '@r'
		| '@a'
		| '@p'
		| '@s'
		| '@e'
		;
}
export import Selected = Select.Obj;
export import SelectString = Select.At;
export type Condition = CommandRslt | Selected;
