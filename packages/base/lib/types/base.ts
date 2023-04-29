/**
 * 功能无关类型定义模块
 * @module @mcdjs/base/lib/types/base
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
declare module './base';

import type { Ased, BInT } from './tool';

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
	export type ValueOf<B extends Enum> = Ased<number, B extends B ? B[KeyOf<B>] : never>;
}
