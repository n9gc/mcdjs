/**
 * 配置相关
 * @module @mcdjs/base/lib/config
 * @version 5.2.3
 * @license GPL-3.0-or-later
 */
declare module './config';

import type * as index from '.';
import type { Enum, Lang } from './types/base';
import type { ArgGetErrList, EType } from './types/errors';
import type { SigreqObj } from './types/tool';

export const env = {
	defaultLang: 'zh-CN',
	config: {
		lang: 'zh-CN',
		track: false,
	} as env.Config,
	setConfig(conf: env.Config) {
		return Object.assign(env.config, conf);
	},
} as const;
export namespace env {
	export interface Config {
		lang: Lang;
		track: boolean;
	}
	export interface Env {
		defaultLang: Lang;
		config: Config;
		setConfig(conf: Config): void;
	}
}
/**检查 {@link env|`env`} 类型是否正确 */
let envTest: env.Env = env;

function getImp() {
	return getImp.Imp || (getImp.Imp = require('.'));
}
namespace getImp {
	export let Imp: typeof index;
}

function throwErr<T extends keyof typeof EType>(n: T, tracker: Error, ...args: ArgGetErrList[typeof EType[T]]) {
	return getImp().errlib.throwErr(getImp().errlib.EType[n], tracker, ...args);
}

export namespace Text {
	export type Obj<T = string, N extends Lang = Lang> = (N extends N ? SigreqObj<N, Lang, T> : never);
	export type EnumTextMap<B extends Enum> = { [I in Enum.ValueOf<B>]?: Obj };
	export type TranObj<B extends Enum> = { [I in Enum.KeyOf<B>]: Obj | string };
	export type RegArgs<B extends Enum> = [name: string, which: B, obj: TranObj<B>];
	export const datas: RegArgs<any>[] = [];
	function initText<K extends string, T = { [I in K]: Obj }>(n: T) {
		return n;
	}
	export const some = initText({
		tracker: {
			'zh-CN': `以下追踪信息仅供参考`,
		},
	});
	const enumNameMap = new Map<Enum, string>;
	export function findName<B extends Enum>(n: B) {
		return enumNameMap.get(n) ?? throwErr('ErrUnregisteredEnum', Error(), n);
	}
	interface EnumObj<B extends Enum> {
		keyMap: EnumTextMap<B>;
		which: B;
	};
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
	function getEnumFn<B extends Enum>(enumObj: EnumObj<B>) {
		return (value: Enum.ValueOf<B>) => sureObj(
			enumObj.keyMap?.[value] as Obj
			?? throwErr('ErrNoEnumText', Error(), findName(enumObj.which), value)
		);
	}
}