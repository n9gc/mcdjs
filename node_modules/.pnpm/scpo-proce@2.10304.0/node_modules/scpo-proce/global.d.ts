import {
	SntXcrNum,
	Accur,
	ArrayLtdSplited,
	Transposed,
} from 'accurtype';

type AnyArr<T = any> = readonly T[];
type First<T> = T extends [infer S, ...AnyArr] ? S : undefined;
declare namespace t {
	import S = scpoProce;
	type lu<T, R extends AnyArr = []> = T extends readonly [infer K, ...infer T1] ? lu<T1, [...R, S.ProceArgs<K>]> : [];
	type le<T> = T extends readonly [infer K, ...infer T1] ? S.ProceErrs<K> | le<T1> : never;
	type tf<T1, R, W> = S.CbNor<T1 extends S.Proce<infer P, infer E> ? W extends 0 ? P : E : W extends 0 ? [] : S.DefE, R, AnyArr>;
	// type sf<F, P extends any[], A extends any[]> = SnakeRslt<[CbNxt<F extends CbNxt<infer K> ? K : any[], P>, ...A]>
	// type sm<B extends any[], E1 extends any[], F, A extends any[]> = SnakeList<B, E1> | [F, ...A]
	// type st<B extends any[], E1 extends any[]> = Proce<B extends [...any[], infer K] ? K : any[], E1>
	// type sn<T> = S.Proce<T extends AnyArr<S.CbNxt<infer P1>> ? P1 : S.DefP, T extends AnyArr<S.CbNxt<AnyArr, AnyArr, infer E1>> ? E1 : S.DefE> extends S.Proce<infer P, infer E> ? S.Proce<P, E> : S.DefProce;
}
declare global {
	/**
	 * 幻想私社异步过程类
	 * @version 2.10304.0
	 * @license GPL-3.0-or-later
	 * @link https://github.com/E0SelmY4V/scpo-proce
	 */
	var scpoProce: scpoProce.pipe;
	namespace scpoProce {
		/**以 {@link P} 和 {@link T} 为参数列表，以 {@link R} 为返回值的函数 */
		type CbNor<P extends AnyArr = AnyArr, R = any, T extends AnyArr = []> = (...arg: [...P, ...T]) => R;
		/**以 {@link P} 为异步结果，以 {@link E} 为异步异常，以 {@link R} 为返回值的 {@link Executor|异步执行器} */
		type CbCur<P extends AnyArr = DefP, E extends AnyArr = DefE, R = any> = CbNor<[CbNor<P, void>, CbNor<E, void>], R, AnyArr>;
		/**在 {@link CbCur|`CbCur`} 的基础上还以 {@link P0} 为上次异步的结果，作为 {@link Nxtlike.next|连续异步} 的 {@link Executor|执行器} */
		type CbNxt<P extends AnyArr = DefP, P0 extends AnyArr = [], E extends AnyArr = DefE, R = any> = CbNor<[CbNor<P, void>, CbNor<E, void>, ...P0], R, AnyArr>;
		/**任意 {@link CbNxt|连续异步执行器} */
		type CbNxtN<P extends AnyArr = AnyArr, P0 extends AnyArr = AnyArr, E extends AnyArr = AnyArr, R = any> = CbNxt<P, P0, E, R>;
		/** 异步执行器，也就是 {@link PromiseConstructor|`Promise`} 的 `executor` 参数 */
		type Executor<P extends AnyArr = AnyArr, P0 extends AnyArr = AnyArr, E extends AnyArr = AnyArr, R = any> = CbCur<P, E, R> | CbNxt<P, P0, E, R>;
		/**或有或无计时器 */
		type STimer = ReturnType<typeof setTimeout> | null;
		/**`ArrayLike<T> | ArrayLike<any>` 中的 `ArrayLike<any>` 或 `T`，其中 `T` 为可选类型参数 {@link T} */
		type ListGot<L, T = AnyArr> = L extends ArrayLike<any> ? L[0] extends T ? L[0] : L : L;
		/**`T[] | [T[], ...any[]]` 中的 `T[]` */
		type ListArrGot<L extends AnyArr> = [L[0]] extends [AnyArr] ? L[0] : L;
		/**默认异步结果 */
		type DefP = any[];
		/**默认异步异常 */
		type DefE = [any];
		/**默认异步类 */
		type DefProce = Proce<DefP, DefE>;
		/**任意 {@link Proce|`Proce`} 实例 */
		type ProceN = Proce<AnyArr, AnyArr>;
		/**{@link T} 作为 {@link Proce|`Proce`} 时的异步结果，或 `[T]` */
		type ProceArgs<T> = T extends Proce<infer A, AnyArr> ? A : [T];
		/**{@link T} 作为 {@link Proce|`Proce`} 时的异步异常，或 `[]` */
		type ProceErrs<T> = T extends Proce<AnyArr, infer A> ? A : [];
		/**以 {@link T} 为长度的 {@link Proce|`Proce`} 元组 */
		type ProceFilled<T extends number, A extends AnyArr<ProceN> = []> = T extends 0 ? A : ProceFilled<SntXcrNum<9, T, number>, [ProceN, ...A]>;
		/**以 {@link D} 为最大深度，从以 {@link P} 为异步结果，以 {@link E} 为异步异常的 {@link Proce|`Proce`} 中提取得到的 {@link Proce|`Proce`} */
		type ProceTaked<P extends AnyArr, E extends AnyArr, D extends number = -1> = D extends 0 ? Proce<P, E> : P extends readonly [Proce<infer PI, infer EI>, ...AnyArr] ? (number extends D ? Proce<P, E> : never) | ProceTaked<PI, EI | E, SntXcrNum<9, D, number>> : Proce<P, E>;
		// type SnakeExpr<T extends AnyArr, E extends AnyArr = DefE, R extends AnyArr = []> = T extends readonly [infer P0 extends AnyArr, infer P extends AnyArr, ...infer K] ? SnakeExpr<[P, ...K], E, [...R, CbNxt<P, P0, E>]> : R;
		// type A = SnakeExpr<[[1, 2, 3], [1], [3]]>;
		// type SnakePArr<T extends AnyArr, F = 0, R extends AnyArr = []> = T extends readonly [CbNxt<infer P, infer S>, ...infer K] ? SnakePArr<K, 1, [...R, ...(F extends 0 ? [S, P] : [P])]> : R;
		// type B = SnakePArr<[CbNxt<[1], [1, 2, 3]>, CbNxt<[3], [1]>]>;
		/**以 {@link Nxtlike.one|`Proce#one`} 的形式处理的异步结果 */
		type OnedArgs<T extends AnyArr> = T extends AnyArr<infer K> ? ProceArgs<K> : never;
		/**以 {@link Nxtlike.all|`Proce#all`} 的形式处理的异步结果 */
		type UedProce<T extends AnyArr> = ArrayLtdSplited<T> extends readonly [infer T0, (infer S)[], infer T2] ? [...t.lu<T0>, ...([ProceArgs<S>] extends [never] ? [] : ProceArgs<S>[]), ...t.lu<T2>] : [];
		/**多 {@link Proce|`Proce`} 工具。包含 {@link Nxtlike.one|`Proce#one`}、{@link Nxtlike.all|`Proce#all`}、{@link Nxtlike.snake|`Proce#snake`} */
		type InterProceTool = ProceN['one' | 'all' | 'snake'];
		/**以 {@link InterProceTool|多 `Proce` 工具} 的形式处理的异步异常 */
		type UedProceE<T extends AnyArr> = ArrayLtdSplited<T> extends readonly [infer T0, (infer S)[], infer T2] ? t.le<T0> | ProceErrs<S> | t.le<T2> : [];
		/**异步类要求开放给用户的部分 */
		interface Nxtlike<P extends AnyArr, E extends AnyArr> {
			/**添加回调 */
			then<RT, E1 extends AnyArr = DefE>(todo?: CbNor<P, RT, AnyArr>): Proce<[RT], E1 | E>;
			/**添加回调和异常捕获回调 */
			then<RT, RO = RT, E1 extends AnyArr = DefE>(todo?: CbNor<P, RT, AnyArr>, ordo?: CbNor<E, RO, AnyArr>): Proce<[RT | RO], E1>;
			/**添加异常捕获回调 */
			trap<RO, E1 extends AnyArr = DefE>(ordo?: CbNor<E, RO, AnyArr>): Proce<P, E1> | Proce<[RO], E1>;
			/**@see {@link Nxtlike.trap|`Proce#trap`} */
			catch: Nxtlike<P, E>['trap'];
			/**以 {@link doexpr} 为 {@link Executor|异步执行器} ，以 {@link config} 为配置选项，再开启一个异步 */
			next<P1 extends AnyArr, E1 extends AnyArr = DefE>(doexpr?: CbNxt<P1, P, E1>, ordo?: CbNor<E1, any, AnyArr>, config?: NxtConfig<P1, E1>): Proce<P1, E1>;
			/**以 {@link depth} 为最大深度提取 {@link P} 里的 {@link Proce|`Proce`} */
			take<D extends number = -1>(depth?: D): ProceTaked<P, E, D>;
			/**提取到 {@link Proce|`Proce`} 之后给其添加回调和异常捕获回调 */
			take<RT, RO = RT, D extends number = -1, T1 = ProceTaked<P, E, D>>(todo: t.tf<T1, RT, 0>, ordo?: t.tf<T1, RO, 1>, depth?: D): Proce<[RT | RO], E>;
			/**提取到 {@link Proce|`Proce`} 之后接着其开启第二次异步 */
			grab<P1 extends AnyArr, E1 extends AnyArr = DefE, D extends number = -1, PT extends AnyArr = ProceTaked<P, E, D> extends Proce<infer P, AnyArr> ? P : P>(doexpr?: CbNxt<P1, PT, E1>, ordo?: CbNor<E1, any, AnyArr>, depth?: D, config?: Config<P1, E1>): Proce<P1, E1>;
			/**以回调形式修改配置 */
			conf<E1>(config?: ConfigN, ordo?: CbNor<E, E1, AnyArr>): Proce<[], [E1]>;
			/**@see {@link ConfigClassConstructor.configAll|`ConfigClass.configAll`} */
			configAll(n?: ConfigN): Proce<P, E>;
			/**得到一个以 {@link n} 为异步结果的已经完成的 {@link Proce|`Proce`} 实例 */
			todo<A extends Accur<A>, P1 extends A[]>(...n: P1): Proce<P1, []>;
			/**得到一个以 {@link n} 为未捕获异步错误的已经完成的 {@link Proce|`Proce`} 实例 */
			ordo<A extends Accur<A>, E1 extends A[]>(...n: E1): Proce<[], E1>;
			/**异步一个接一个 */
			snake<N extends AnyArr<CbNxtN | AnyArr<CbNxtN>>>(...n: N | [[...N]]): Proce<N extends readonly [...any[], CbNxtN<infer S>] ? S : DefP, E | DefE>;
			/**得到数组中最快完成的 {@link Proce|`Proce`} 的异步结果 */
			one<A extends Accur<A>, T extends A | AnyArr<A>, N extends T[]>(...n: [...N]): Proce<OnedArgs<ListArrGot<N>>, UedProceE<ListArrGot<N>>>;
			/**得到数组中所有 {@link Proce|`Proce`} 的异步结果 */
			all<A extends Accur<A>, T extends A | AnyArr<A>, N extends T[]>(...n: [...N]): Proce<Transposed<UedProce<ListArrGot<N>>>, UedProceE<ListArrGot<N>>>;
			/**配置 */
			config: ConfigClass<P, E>;
		}
		/**
		 * 异步过程类
		 *
		 * 类型参数 {@link P} 表示异步结果，类型参数 {@link E} 表示异步异常
		 */
		interface Proce<P extends AnyArr, E extends AnyArr> extends Nxtlike<P, E> {
			/** {@link Executor|异步执行器} 接受的 `todo` 参数 (类似 {@link PromiseConstructor|`Promise`} 的 `executor` 参数的 `resolve` 参数) */
			ftodo: CbNor<P, void>;
			/** {@link Executor|异步执行器} 接受的 `ordo` 参数 (类似 {@link PromiseConstructor|`Promise`} 的 `executor` 参数的 `reject` 参数) */
			fordo: CbNor<E, void>;
			/**回调列表 */
			queuetodo: AnyArr<CbNor<P>>;
			/**异常捕获回调列表 */
			queueordo: AnyArr<CbNor<E>>;
			/**是否已完成异步过程 */
			cleared: boolean;
			/**是否已开始异步过程，或者说是否已执行完异步执行器 */
			acted: boolean;
			/**是否不可能有多个结果，或者说是否已经执行过至少一个回调 */
			nmArg: boolean;
			/**结果或异常 */
			lastRtn: P | First<P> | E | First<E>;
			/**异常抛出计时器 */
			lastErr: STimer;
			/**{@link Config.todo|默认回调} 或 {@link Config.ordo|默认异常捕获回调} 的调用计时器 */
			lastDef: STimer;
			/**回调处理到的位置 */
			pointer: number;
		}
		interface ProceConstructor {
			/**构造一个 {@link Proce|异步过程类} */
			new <P extends AnyArr, E extends AnyArr = DefE>(doexpr?: CbCur<P, E>, config?: Config<P, E>, cleared?: boolean): Proce<P, E>;
		}
		/**
		 * {@link Proce|`Proce`} 配置
		 *
		 * 类型参数 {@link P} 表示异步结果，类型参数 {@link E} 表示异步异常
		 */
		interface Config<P extends AnyArr, E extends AnyArr> {
			/**
			 * 是否捕获 {@link Executor|异步执行器} 返回的 {@link PromiseLike|`Thenable`} 的异常
			 * @default true
			 */
			actTrap?: boolean | null;
			/**
			 * 未捕获异常处理等级
			 * - `"ignore"` 啥都不干
			 * - `"log"` 使用 {@link console.error|`console.error`} 提示异常
			 * - `"throw"` 抛出异常，可能导致意外终止
			 * @default 'log'
			 */
			errlv?: 'log' | 'throw' | 'ignore' | null;
			/**
			 * 默认回调
			 * @default null
			 */
			todo?: CbNor<P> | null;
			/**
			 * 默认异常捕获回调
			 * @default null
			 */
			ordo?: CbNor<E> | null;
		}
		/**连续异步的配置 */
		interface NxtConfig<P extends AnyArr, E extends AnyArr> extends Config<P, E> {
			/**
			 * 是否需要截断异常捕获链
			 * @default false
			 */
			stopTrap?: null | boolean;
		}
		interface AllConfig<P extends AnyArr, E extends AnyArr> extends NxtConfig<P, E>, Config<P, E> { }
		/**任意 {@link Config|`Proce` 配置} */
		type ConfigN = AllConfig<AnyArr, AnyArr>;
		/**{@link Proce|`Proce`} 配置类 */
		interface ConfigClass<P extends AnyArr, E extends AnyArr> extends AllConfig<P, E> {
			/**修改自己的配置 */
			set<P1 extends AnyArr, E1 extends AnyArr = DefE>(n?: Config<P1, E1>): ConfigClass<P1, E1>;
			/**以 {@link n} 为主，使用自己补充，得到一个新的 {@link ConfigClass|`Proce` 配置类} */
			get<P1 extends AnyArr, E1 extends AnyArr = DefE>(n?: Config<P1, E1>): ConfigClass<P1, E1>;
			actTrap: {} & Config<P, E>['actTrap'];
			errlv: {} & Config<P, E>['errlv'];
			stopTrap: {} & NxtConfig<P, E>['stopTrap'];
		}
		interface ConfigClassConstructor {
			/**构造一个 {@link ConfigClass|`Proce` 配置类} */
			new <P extends AnyArr = DefP, E extends AnyArr = DefE>(n: Config<P, E>, proc?: Proce<P, E>): ConfigClass<P, E>;
			/**修改全局默认配置，也就是修改配置类的原型属性 */
			configAll(n?: ConfigN): void;
		}
		/**任意 {@link ConfigClass|`Proce` 配置类} */
		type ConfigClassN = ConfigClass<AnyArr, AnyArr>;
		/**@see {@link scpoProce|`scpoProce`} */
		interface pipe extends Nxtlike<[], []> {
			/**以 {@link doexpr} 为 {@link Executor|异步执行器} ，以 {@link config} 为配置选项，来开启一次异步 */
			<P extends AnyArr, E extends AnyArr = DefE>(doexpr: CbCur<P, E>, config?: Config<P, E>): Proce<P, E>;
			/**得到一个以 {@link arg} 为异步结果的已经完成的 {@link Proce|`Proce`} 实例 */
			<A extends Accur<A>, P extends A[]>(...arg: P): Proce<P, []>;
			/**是否在裸浏览器环境下 */
			notModule: boolean;
			/**是否有 {@link Object.keys|`Object.keys`} 方法可以用 */
			hasObject_keys: boolean;
			/**当前环境可以如何报错 */
			errAbled: "log" | "alert" | "error" | "none";
			/**用来区分 {@link scpoProce|`scpoProce`} 和 {@link Proce|`Proce` 实例} */
			isPipe: true;
			/**以数组形式的参数 {@link p} 调用函数 {@link f} */
			apply<P extends AnyArr, R>(f: (...param: [...P]) => R, p: P): R;
			/**判断 {@link n} 是否是 {@link PromiseLike|`Thenable`} */
			isThenable(n: any): n is PromiseLike<any>;
			/**判断 {@link n} 是否是 {@link ArrayLike|`ArrayLike`} */
			isArrayLike(n: any): n is ArrayLike<any>;
			/**{@link ArrayLike|`ArrayLike`} 转 {@link Array|`Array`} */
			arrayFrom<T>(n: ArrayLike<T>): T[];
			/**得到 `ArrayLike<T> | ArrayLike<ArrayLike<T>>` 中的 `ArrayLike<T>` */
			getList<N>(list: N): ListGot<N, ArrayLike<any>>;
			/**获取 ID */
			getId(): number;
			/**把 {@link b} 里的东西都浅拷贝到 {@link a} 里 */
			forIn<A, B>(a: A, b: B): void;
			/**@see {@link ConfigClass|`Proce` 配置类} */
			ConfigClass: ConfigClassConstructor;
			/**执行 {@link _t} 的单个回调 */
			doRtn<R, T extends ProceN, P extends AnyArr = ProceArgs<T>, E extends AnyArr = ProceErrs<T>>(_t: T, expr: CbNor<P, R>, param: P | P[0] | E | E[0]): R;
			/**执行 {@link _t} 的 {@link Executor|异步执行器} */
			act<R, T extends ProceN, R0 extends AnyArr = [], P extends AnyArr = ProceArgs<T>, E extends AnyArr = ProceErrs<T>>(_t: T, doexpr: CbNxt<P, R0, E, R> | CbCur<P, E, R>, args: R0): void;
			/**执行 {@link _t} 的回调列表 */
			clear<T extends ProceN, P extends AnyArr = ProceArgs<T>>(_t: T, param: P | P[0]): void;
			/**为 {@link _t} 使用异常捕获回调处理异常 */
			exeordo<T extends ProceN, E extends AnyArr = ProceErrs<T>>(_t: T, param: E | E[0]): any;
			/**为 {@link _t} 异步抛出未捕获的异常 */
			toss<T extends ProceN, E extends AnyArr = ProceErrs<T>>(_t: T, errObj: E[0]): void;
			/**@see {@link Proce|异步过程类} */
			Proce: ProceConstructor;
		}
		/**可以执行 {@link Executor|异步执行器} 的东西 */
		type Nxtable = ProceN | typeof scpoProce;
	}
}
