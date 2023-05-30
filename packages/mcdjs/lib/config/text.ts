/**
 * 文本配置处理相关
 * @module mcdjs/lib/config/text
 * @version 1.0.2
 * @license GPL-2.0-or-later
 */
declare module './text';

import type { Enum, Lang } from '../types/base';
import type { SigreqObj } from '../types/tool';
import env from './env';
import { throwErr } from './tool';

export type Obj<T = string, N extends Lang = Lang> = (N extends N ? SigreqObj<N, Lang, T> : never);

export function initText<K extends string, T = { [I in K]: Obj }>(n: T) {
	return n;
}

const enumNameMap = new Map<Enum, string>;
export function findName<B extends Enum>(n: B) {
	return enumNameMap.get(n) ?? throwErr('ErrUnregisteredEnum', Error(), n);
}

export type EnumTextMap<B extends Enum> = { [I in Enum.ValueOf<B>]?: Obj };
export type TranObj<B extends Enum> = { [I in Enum.KeyOf<B>]: Obj | string };
export type RegArgs<B extends Enum> = [name: string, which: B, obj: TranObj<B>];
export function regEnum<B extends Enum>(...[name, which, obj]: RegArgs<B>) {
	enumNameMap.set(which, name);
	let keyMap: EnumTextMap<B> = {};
	let i: keyof typeof obj;
	for (i in obj) {
		const k = (which as any)[i] as Enum.ValueOf<B>;
		const ele: Obj | string = obj[i];
		keyMap[k] = typeof ele === 'string' ? { [env.defaultLang]: ele } : ele;
	}
	return getEnumFn({ keyMap, which });
}
export function sureObj<N>(obj: Obj<N>) {
	return obj[env.config.lang]
		?? obj[env.defaultLang]
		?? obj[Object.keys(obj)[0] as Lang] as N;
}
interface EnumObj<B extends Enum> {
	keyMap: EnumTextMap<B>;
	which: B;
};
function getEnumFn<B extends Enum>(enumObj: EnumObj<B>) {
	return (value: Enum.ValueOf<B>) => sureObj(
		enumObj.keyMap?.[value] as Obj
		?? throwErr('ErrNoEnumText', Error(), findName(enumObj.which), value)
	);
}
