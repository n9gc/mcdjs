/**
 * 工具类型定义模块
 * @module @mcdjs/base/lib/types/tool
 * @version 1.3.6
 * @license GPL-3.0-or-later
 */
declare module './tool';

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

/**扔掉首元素 */
export type Shifted<T extends AnyArr> = T extends readonly [any, ...infer T] ? T : T;

export type SigreqObj<N extends C, C extends string, T> = { [I in N]: T } & { [I in C]?: T };
