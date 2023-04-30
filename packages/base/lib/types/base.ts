/**
 * 功能无关类型定义模块
 * @module @mcdjs/base/lib/types/base
 * @version 1.2.0
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
	const keyMap = new Map<Enum,string[]>;
	export function keyOf<T extends Enum>(which: T) {
		if (keyMap.has(which)) return keyMap.get(which) as KeyOf<T>[];
		const keys = mapIn(which, (_, k) => k);
		keyMap.set(which, keys);
		return keys;
 	}

	/**枚举的值 */
	export type ValueOf<B extends Enum, K extends KeyOf<B> = KeyOf<B>> = Ased<number, B extends B ? B[K] : never>;
	const valueMap = new Map<Enum,number[]>;
	export function valueOf<T extends Enum>(which: T) {
		if (valueMap.has(which)) return valueMap.get(which) as ValueOf<T>[];
		const values = mapIn(which, v => v);
		valueMap.set(which, values);
		return values as ValueOf<T>[];
 	}

	/**根据 {@link T} 生成类似枚举的对象 */
	export type From<T extends AnyArr<string>> = RevedObj<MapOfArray<T>> & MapOfArray<T>;
	export function from<T extends AnyArr<string>>(keys: T) {
		const rslt: Enum = {};
		keys.forEach((key, value) => rslt[rslt[key] = value] = key);
		return rslt as From<T>;
	}

	export function isKeyOf<T extends Enum>(which: T, n: string): n is KeyOf<T> {
		return typeof which[n] === 'number';
	}

	export function mapIn<T extends Enum, R>(which: T, cb: (value: number, key: KeyOf<T>) => R): R[] {
		const rslt = [];
		let i = 0;
		while (i in which) rslt.push(cb(i, which[i++] as KeyOf<T>));
		return rslt;
	}
}
