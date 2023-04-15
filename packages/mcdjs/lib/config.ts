/**
 * 配置相关
 * @module mcdjs/lib/config
 * @version 5.1.0
 * @license GPL-3.0-or-later
 */
declare module './config';

import Imp from '.';
import Temp, { Types, reger0 } from './alload';
import type { EType } from './errlib';
import type { NType } from './magast/nodes';

reger0('config', exports);

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
		& { [J in env.OptionalLang]?: string };
	type EnumTypeMap = {
		NType: typeof NType;
		EType: typeof EType;
		TypeId: typeof Temp.Struct.Types.TypeId;
		CbType: typeof Temp.Struct.Types.CbType;
	};
	function initEnumNameMap<T extends EnumName>(which: EnumTypeMap[T]) {
		switch (which) {
			case Imp?.errlib?.EType: return 'EType' as T;
			case Imp?.magast?.nodes?.NType: return 'NType' as T;
			case Temp?.Struct?.Types?.CbType: return 'CbType' as T;
			case Temp?.Struct?.Types?.TypeId: return 'TypeId' as T;
		}
		console.log(which);
		throw Error();
	}
	export type EnumTypes = EnumTypeMap[EnumName];
	export type EnumNameOf<
		B extends EnumTypes,
		N = Types.EachOfUnion<EnumName>>
		= (N extends [infer I extends EnumName, ...infer N]
			? (Types.EqualTo<B, EnumTypeMap[I]> extends true
				? I
				: EnumNameOf<B, N>
			)
			: never
		);
	export type EnumName = keyof EnumTypeMap;
	export type EnumKey<I extends EnumName> = I extends I ? keyof EnumTypeMap[I] : never;
	export type EnumValue<I extends EnumName> = I extends I ? EnumTypeMap[I][EnumKey<I>] : never;
	export type EnumKeys = EnumKey<EnumName>;
	type EnumObjTypes<K extends EnumName> = { [I in EnumValue<K>]?: Obj };
	type EnumObj = { [K in EnumName]?: EnumObjTypes<K> };
	let enumObj: EnumObj = {};
	export function regEnum<B extends EnumTypes, T extends EnumName = EnumNameOf<B>>(which: B, obj: { [I in EnumKey<T>]: Obj | string }) {
		let finObj: EnumObjTypes<T> = {};
		let i: keyof typeof obj;
		for (i in obj) {
			const k = which[i as keyof B] as EnumValue<T>;
			const ele: Obj | string = obj[i];
			finObj[k] = typeof ele === 'string' ? { [env.defaultLang]: ele } : ele;
		}
		enumObj[initEnumNameMap(which)] = finObj;
	}
	export function getEnum<T extends Text.EnumName>(type: T, name: Text.EnumValue<T>) {
		const nameObj = enumObj[type]?.[name] ?? Imp.errlib.throwErr(Imp.errlib.EType.ErrNoEnumText, Error(), type, name);
		return nameObj[env.config.lang] ?? nameObj[env.defaultLang];
	}
}