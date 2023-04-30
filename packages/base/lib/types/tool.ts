/**
 * 工具类型定义模块
 * @module @mcdjs/base/lib/types/tool
 * @version 1.4.0
 * @license GPL-3.0-or-later
 */
declare module './tool';

/**可以做对象键的东西 */
export type AnyKey = keyof any;

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

/**类似字符串类型 */
export type NotStr = Exclude<Tostrable, string>;

/**可能为字符串的 {@link T} */
export type MayStr<T extends Tostrable> = T | `${T}`;

/**把由 {@link T} 变成的字符串 {@link N} 变回去 */
export type Instr<N extends string, T extends Tostrable = NotStr> = N extends `${Exted<infer S, T>}` ? S : never;

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

/**一个键为 {@link C} 的除了其中键 {@link N} 以外全为可选 {@link T} 的对象 */
export type SigreqObj<N extends C, C extends string, T> = { [I in N]: T } & { [I in C]?: T };

/**一个存储数组 {@link T} 中元素和索引对应关系的对象 */
export type MapOfArray<T extends AnyArr> = { [I in Instr<BInT<keyof T, `${number}`>, number>]: T[I] };

/**可以被反转的对象 */
export type Revable = { [x: number | string]: number | string; };
type RevedObjOri<T extends Revable, N extends keyof T = BInT<keyof T, number | string>> = N extends N ? { [I in T[N]]: N } : never;
/**反转对象。就是把值作键，把键作值 */
export type RevedObj<T extends Revable> = InterOfUnion<RevedObjOri<T>>;
export function revMap<T extends Revable>(map: T) {
	const rslt: Revable = {};
	for (const key of Object.keys(map)) rslt[map[key]] = key;
	return rslt as RevedObj<T>;
}

/**把对象 {@link O} 中由 {@link T} 变成的字符串全变回去 */
export type EvaledMap<O, T extends Tostrable = NotStr> = { [I in keyof O]: O[I] extends `${Exted<infer K, T>}` ? K : O[I] };

type SWLArr<L extends 0 | 1, A, S extends AnyArr> = [readonly [A, ...S], readonly [...S, A]][L];
/**切割元组的有限和无限部分 */
export type SWArray<
	S extends AnyArr,
	L extends 0 | 1 = 0,
	R extends AnyArr = []>
	= (S extends SWLArr<L, infer A, infer S>
		? SWArray<S, L, [[...R, A], [A, ...R]][L]>
		: (L extends 0
			? [R, ...SWArray<S, 1>]
			: [S, R]
		)
	);
/**更方便的匹配切割后的元组 */
export type SWTmpl<A extends [AnyArr, AnyArr, AnyArr]> = A;

type RevedArrLtd<
	T extends AnyArr,
	R extends AnyArr = []>
	= (T extends readonly [infer S, ...infer T]
		? RevedArrLtd<T, [S, ...R]>
		: R
	);
/**反转数组 */
export type RevedArr<T extends AnyArr> = SWArray<T> extends SWTmpl<infer R> ? [...RevedArrLtd<R[2]>, ...R[1], ...RevedArrLtd<R[0]>] : never;

/**{@link Object.keys} 得到的结果 */
export type KeyArrayOf<T> = RevedArr<EachOfUnion<keyof T>>
