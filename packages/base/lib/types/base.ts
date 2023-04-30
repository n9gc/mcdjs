/**
 * 功能无关类型定义模块
 * @module @mcdjs/base/lib/types/base
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
declare module './base';

import type { AnyArr, Ased, BInT, MapOfArray, RevedObj } from './tool';

export type Lang =
	| 'en-US'
	| 'zh-CN'
	;

export namespace Text {
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
	export type ValueOf<B extends Enum, K extends KeyOf<B> = KeyOf<B>> = Ased<number, B extends B ? B[K] : never>;

	/**根据 {@link T} 生成类似枚举的对象 */
	export type From<T extends AnyArr<string>> = RevedObj<MapOfArray<T>> & MapOfArray<T>;
	export function from<T extends AnyArr<string>>(keys: T) {
		const rslt: Enum = {};
		keys.forEach((key, value) => rslt[rslt[key] = value] = key);
		return rslt as From<T>;
	}
}
