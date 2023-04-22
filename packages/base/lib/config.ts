/**
 * 配置相关
 * @module @mcdjs/base/lib/config
 * @version 5.1.4
 * @license GPL-3.0-or-later
 */
declare module './config';

import * as Imp from '.';
import type { Ased, BInT } from './types';

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
	export type Lang =
		| 'en-US'
		| 'zh-CN'
		;
	export type DefaultLang = typeof env.defaultLang;
	export type OptionalLang = Exclude<Lang, DefaultLang>;
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

export namespace Text {
	function initText<K extends string, T = { [I in K]: Obj }>(n: T) {
		return n;
	}
	export const some = initText({
		tracker: {
			'zh-CN': `以下追踪信息仅供参考`,
		},
	});
	export type Obj =
		& { [env.defaultLang]: string; }
		& { [J in env.OptionalLang]?: string }
		;
	export interface Enum {
		[key: number | string]: number | string;
	}
	export type EnumKeyOf<B extends Enum> = B extends B ? BInT<keyof B, string> : never;
	export type EnumValueOf<B extends Enum> = Ased<number, B extends B ? B[EnumKeyOf<B>] : never>;
	type EnumTextMap<B extends Enum> = { [I in EnumValueOf<B>]?: Obj };
	interface EnumObj<B extends Enum> {
		keyMap: EnumTextMap<B>;
		which: B;
	};
	type TranObj<B extends Enum> = { [I in EnumKeyOf<B>]: Obj | string };
	const enumNameMap = new Map<Enum, string>;
	export function findName<B extends Enum>(n: B) {
		return enumNameMap.get(n)
			?? Imp.errlib.throwErr(Imp.errlib.EType.ErrUnregisteredEnum, Error(), n);
	}
	export function regEnum<B extends Enum>(name: string, which: B, obj: TranObj<B>) {
		enumNameMap.set(which, name);
		let keyMap: EnumTextMap<B> = {};
		let i: keyof typeof obj;
		for (i in obj) {
			const k = (which as any)[i] as EnumValueOf<B>;
			const ele: Obj | string = obj[i];
			keyMap[k] = typeof ele === 'string' ? { [env.defaultLang]: ele } : ele;
		}
		return getEnumFn({ keyMap, which });
	}
	function getEnumFn<B extends Enum>(enumObj: EnumObj<B>) {
		return (value: EnumValueOf<B>) => {
			const nameObj = enumObj.keyMap?.[value]
				?? Imp.errlib.throwErr(Imp.errlib.EType.ErrNoEnumText, Error(), findName(enumObj.which), value);
			return nameObj[env.config.lang] ?? nameObj[env.defaultLang];
		};
	}
}