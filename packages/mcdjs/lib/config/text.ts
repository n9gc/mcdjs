/**
 * 文本配置处理相关
 * @module mcdjs/lib/config/text
 * @version 1.1.0
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
export function getEnumName<B extends Enum>(n: B) {
	return enumNameMap.get(n) ?? throwErr('ErrUnregisteredEnum', Error(), n);
}

export type EnumTextMap<B extends Enum> = { [I in Enum.ValueOf<B>]?: Obj };
export type TranObj<B extends Enum> = { [I in Enum.KeyOf<B>]?: Obj | string };
export type RegArgs<B extends Enum> = [name: string, which: B, obj?: TranObj<B>];
export interface GetTextFn<B extends Enum> {
	(value: Enum.ValueOf<B>): string;
	addTranObj(obj: TranObj<B>): this;
}
export function sureObj<N>(obj: Obj<N>) {
	return obj[env.config.lang]
		?? obj[env.defaultLang]
		?? obj[Object.keys(obj)[0] as Lang] as N;
}
export function regEnum<B extends Enum>(...[name, which, obj]: RegArgs<B>): GetTextFn<B> {
	enumNameMap.set(which, name);
	const getTextFn = (value: Enum.ValueOf<B>) => sureObj(
		keyMap?.[value] as Obj
		?? throwErr('ErrNoEnumText', Error(), getEnumName(which), value)
	);
	const keyMap: EnumTextMap<B> = {};
	getTextFn.addTranObj = (obj: TranObj<B>) => {
		let i: keyof typeof obj;
		for (i in obj) {
			const k = (which as any)[i] as Enum.ValueOf<B>;
			const ele: Obj | string | undefined = obj[i];
			keyMap[k] = typeof ele === 'string' ? { [env.defaultLang]: ele } : ele;
		}
		return getTextFn;
	};
	if (obj) getTextFn.addTranObj(obj);
	return getTextFn;
}
