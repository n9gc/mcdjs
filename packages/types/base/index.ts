/**
 * 功能无关类型定义模块
 * @module @mcdjs/types/base
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module '.';

import { Ased, BInT } from '../tool';

export type Lang =
	| 'en-US'
	| 'zh-CN'
	;


export type SigreqObj<N extends C, C extends string, T> = { [I in N]: T } & { [I in C]?: T };

export namespace Text {
	export type Obj<T = string, N extends Lang = Lang> = (N extends N ? SigreqObj<N, Lang, T> : never);
	export type EnumTextMap<B extends Enum> = { [I in Enum.ValueOf<B>]?: Obj };
	export type TranObj<B extends Enum> = { [I in Enum.KeyOf<B>]: Obj | string };
	export type RegArgs<B extends Enum> = [name: string, which: B, obj: TranObj<B>];
	export const datas: RegArgs<any>[] = [];
	export function regData<B extends Enum>(...args: RegArgs<B>) {
		datas.push(args);
	}
}

export import Enum = Enum.Enum;
export namespace Enum {
	/**枚举 */
	export interface Enum {
		[key: number | string]: number | string;
	}

	/**枚举的键 */
	export type KeyOf<B extends Enum> = BInT<keyof B, string>;

	/**枚举的值 */
	export type ValueOf<B extends Enum> = Ased<number, B extends B ? B[KeyOf<B>] : never>;
}
