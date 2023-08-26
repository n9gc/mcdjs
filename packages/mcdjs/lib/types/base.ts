/**
 * 功能无关类型定义模块
 * @module mcdjs/lib/types/base
 * @version 1.5.0
 * @license GPL-2.0-or-later
 */
declare module './base';

import type { AnyArr, Ased, BInT, KeyArrayOf, MapOfArray, RevedObj } from './tool';

export type Lang =
	| 'en-US'
	| 'zh-CN'
	;

export function listKeyOf<T extends {}>(n: T): Readonly<KeyArrayOf<T>> {
	return Object.keys(n) as any;
}

export type Enum = Enum.Enum;
export namespace Enum {
	/**枚举 */
	export interface Enum {
		[key: number | string]: number | string;
	}

	type StrKeyOf<B> = BInT<keyof B, string>;
	type ExtedKeyOf<B, V, K extends keyof B> = K extends K ? B[K] extends V ? K : never : never;

	/**枚举的键 */
	export type KeyOf<B extends Enum, V extends ValueOf<B> = ValueOf<B>> = ExtedKeyOf<B, V, StrKeyOf<B>>;
	const keyMap = new Map<Enum, string[]>;
	export function keyOf<T extends Enum>(which: T) {
		if (keyMap.has(which)) return keyMap.get(which) as KeyOf<T>[];
		const keys = mapIn(which, (_, k) => k);
		keyMap.set(which, keys);
		return keys;
	}

	/**枚举的值 */
	export type ValueOf<B extends Enum, K extends StrKeyOf<B> = StrKeyOf<B>> = Ased<number, B[K]>;
	const valueMap = new Map<Enum, number[]>;
	export function valueOf<T extends Enum>(which: T) {
		if (valueMap.has(which)) return valueMap.get(which) as ValueOf<T>[];
		const values = mapIn(which, v => v);
		valueMap.set(which, values);
		return values as ValueOf<T>[];
	}

	/**根据 {@link T} 生成类似枚举的对象 */
	export type From<T extends AnyArr<string>> = Readonly<RevedObj<MapOfArray<T>> & MapOfArray<T>>;
	export function from<T extends AnyArr<string>>(keys: T) {
		const rslt: Enum = {};
		keys.forEach((key, value) => rslt[rslt[key] = value] = key);
		return rslt as From<T>;
	}

	export function isKeyOf<T extends Enum>(which: T, n: string): n is KeyOf<T> {
		return typeof which[n] === 'number';
	}

	export function mapIn<T extends Enum, R>(which: T, cb: (value: ValueOf<T>, key: KeyOf<T>) => R): R[] {
		const rslt = [];
		let i = 0;
		while (i in which) rslt.push(cb(i as ValueOf<T>, which[i++] as KeyOf<T>));
		return rslt;
	}
}

abstract class InitializableMap<K, V> extends Map<K, V> {
	protected abstract initializeValue(): V;
	forceGet(key: K) {
		let value = this.get(key);
		if (value) return value;
		value = this.initializeValue();
		this.set(key, value);
		return value;
	}
}
export class ArrayMap<K, T> extends InitializableMap<K, T[]> {
	protected initializeValue(): T[] {
		return [];
	}
	push(key: K, ...items: T[]) {
		this.forceGet(key).push(...items);
	}
}
export interface ReadonlyArrayMap<K, T> extends ReadonlyMap<K, readonly T[]> { }

export namespace Template {
	export type ArgsJoin = [literals: { raw: readonly string[]; }, ...values: any[]];
	export function join(...args: ArgsJoin) {
		const [{ raw }, ...values] = args;
		const outArr: any[] = [];
		values.forEach((n, i) => outArr.push(raw[i], n));
		outArr.push(raw.at(-1));
		return outArr.join('');
	}
}
