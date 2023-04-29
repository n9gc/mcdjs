/**
 * 类型定义模块
 * @module @mcdjs/types
 * @version 1.3.3
 * @license GPL-3.0-or-later
 */
declare module '.';

/**空回调 */
export type Vcb = () => void;

/**联合类型 {@link T} 中被 {@link B} 包含的那些类型 */
export type BInT<T, B> = T extends B ? T : never;

/**用 `Exted<infer C, D>` 可代替 `infer C extends D` */
export type Exted<C extends D, D> = C;

/**保证 {@link T} 被 {@link N} 包含 */
export type Ased<N, T> = BInT<T, N>;

/**任意数组 */
export type AnyArr<T = any> = readonly T[];

/**广义的数字类型 */
export type WideNum = number | bigint;

/**可以用来表示数字的类型 */
export type MayNum = WideNum | string;

/**可以被转换为字符串的类型 */
export type Tostrable = boolean | MayNum | null | undefined;

/**比较类型 {@link A} 和 {@link B} 是否完全相同 */
export type EqualTo<A, B> = (<F>() => F extends A ? 1 : 0) extends (<F>() => F extends B ? 1 : 0) ? true : false;

/**把联合类型 {@link N} 变成交叉类型 */
export type InterOfUnion<N> = (N extends N ? (n: N) => 0 : 0) extends (n: infer K) => 0 ? K : never;

type OneOfUnion<N> = InterOfUnion<N extends N ? () => N : 0> extends () => infer K ? K : N;
/**把联合类型 {@link N} 拆分成元组 */
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

/**由元组 {@link L} 中元素构成的不重复数组 */
export type UniqueItems<
	L extends any[],
	R extends any[] = []>
	= (L extends [infer S, ...infer K]
		? [S, ...UniqueItems<[...R, ...K]>] | UniqueItems<K, [S, ...R]>
		: []
	);

/**以 {@link F} 为分隔符，将元组 {@link S} 拼接起来 */
export type Joined<
	S extends Tostrable[],
	F extends Tostrable,
	R extends string = ''>
	= (S extends [infer I extends Tostrable, ...infer S extends [any, ...any[]]]
		? Joined<S, F, `${R}${I}${F}`>
		: `${R}${S[0]}`
	);

export import Enum = Enum.Enum;
export namespace Enum {
	/**枚举 */
	export interface Enum {
		[key: number | string]: number | string;
	}

	/**枚举的键 */
	export type KeyOf<B extends Enum> = B extends B ? BInT<keyof B, string> : never;

	/**枚举的值 */
	export type ValueOf<B extends Enum> = Ased<number, B extends B ? B[KeyOf<B>] : never>;
}

/**扔掉首元素 */
export type Shifted<T extends AnyArr> = T extends readonly [any, ...infer T] ? T : T;

/**接口标识 */
export enum TypeId {
	CommandRslt,
	Selected,
	SimTag,
}
// export const tranumTypeId = Text.regEnum('TypeId', TypeId, {
// 	CommandRslt: '命令结果表示',
// 	Selected: '选择器表示',
// 	SimTag: '标签表示',
// });

/**命令方块类型 */
export enum CbType {
	Impulse,
	Chain,
	Repeat,
}
// export const tranumCbType = Text.regEnum('CbType', CbType, {
// 	Impulse: '脉冲',
// 	Chain: '链式',
// 	Repeat: '重复',
// });

// export interface RoundParsed extends Array<AST> {
// }

/**命令运行结果 */
export interface CommandRslt {
	index: number;
	tid: TypeId.CommandRslt;
}

export import Sim = Sim.Base;
export import SimTag = Sim.Tag;
export namespace Sim {
	/**形式数据 */
	export interface Base {
		tid: TypeId;
		name: string;
	}

	/**形式标签 */
	export interface Tag extends Base {
		toString(): string;
		tid: TypeId.SimTag;
	}
}

export import Expression = Expression.Any;
export namespace Expression {
	/**单目运算符 */
	export type OperatorSig =
		| '!'
		| 'not'
		;

	/**双目运算符 */
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

	/**运算符 */
	export type Operator =
		| OperatorBin
		| OperatorSig
		;

	/**可操作类型 */
	export type Calcable =
		| Sub
		| SimTag
		;

	/**单目表达式 */
	export type SubSig = [OperatorSig, Calcable];

	/**双目表达式 */
	export type SubBin = [Calcable, OperatorBin, Calcable];

	/**子表达式 */
	export type Sub =
		| SubSig
		| SubBin
		;

	/**表达式 */
	export type Any = null | Calcable;
}

export import Selected = Select.Obj;
export import SelectString = Select.At;
/**选择相关 */
export namespace Select {
	/**选择器结果 */
	export interface Obj {
		expr: Expression;
		range: At;
		tid: TypeId.Selected;
	}

	/**选择字符串 */
	export type At =
		| '@r'
		| '@a'
		| '@p'
		| '@s'
		| '@e'
		;
}

/**条件 */
export type Condition = CommandRslt | Selected;
