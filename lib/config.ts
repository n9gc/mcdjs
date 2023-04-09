/**
 * 配置相关
 * @module mcdjs/lib/config
 * @version 5.0.0
 * @license GPL-3.0-or-later
 */
declare module './config';

import Temp from './alload';
import type { EType, throwErr } from './errlib';
import type { NType } from './magast';

export const env = {
	version: '0.9.2',
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
		| 'zh-CN';
	export type DefaultLang = typeof env.defaultLang;
	export type OptionalLang = Exclude<Lang, DefaultLang>;
	export interface Config {
		lang: Lang;
		track: boolean;
	}
	export interface Env {
		version: string;
		defaultLang: Lang;
		config: Config;
		setConfig(conf: Config): void;
	}
}
/**检查 {@link env|`env`} 类型是否正确 */
let envTest: env.Env = env;

export namespace Text {
	export type Obj =
		& { [env.defaultLang]: string; }
		& { [J in env.OptionalLang]?: string };
	export type EnumTypeMap = {
		NType: typeof NType;
		EType: typeof EType;
	};
	export type EnumKeyMap = { [I in keyof EnumTypeMap]: keyof EnumTypeMap[I] };
	export type EnumValueMap = { [I in keyof EnumTypeMap]: EnumTypeMap[I][EnumKeyMap[I]] };
	export type EnumKeys = EnumKeyMap[keyof EnumKeyMap];
	export type EnumName = keyof EnumValueMap;
	function initText<K extends string, T = { [I in K]: Obj }>(n: T) {
		return n;
	}
	export const some = initText({
		tracker: {
			'zh-CN': `以下追踪信息仅供参考`,
		},
	});
	type EnumObjTypes<K extends EnumName> = { [I in EnumValueMap[K]]: Obj };
	type EnumObj = { [K in EnumName]: EnumObjTypes<K> };
	let enumObj: Partial<EnumObj> = {};
	export function regEnum<T extends EnumName>(which: T, obj: { [I in keyof EnumObj[T]]: EnumObj[T][I] | string }) {
		for (const i in obj) if (typeof obj[i] === 'string') (obj as any)[i] = { [env.defaultLang]: obj[i] };
		console.log(obj);
		enumObj[which] = (obj as EnumObj[T]);
	}
	export function getEnum<T extends Text.EnumName>(type: T, name: Text.EnumValueMap[T]) {
		const nameObj = enumObj[type]?.[name] ?? Temp.Imp.errlib.throwErr(Temp.Imp.errlib.EType.ErrNoEnumText, Error(), type, name);
		return nameObj[env.config.lang] ?? nameObj[env.defaultLang];
	}
}