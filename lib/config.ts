/**
 * 配置相关
 * @module mcdjs/lib/config
 * @version 4.0.0
 * @license GPL-3.0-or-later
 */
declare module './config';

import { EType } from './errlib';
import { NType } from './genast';

export const env = {
	version: '0.9.2',
	defaultLang: 'zh-CN',
	config: {
		lang: 'zh-CN',
	} as env.Config,
	setConfig(conf: env.Config) {
		return Object.assign(env.config, conf);
	},
} as const;
export namespace env {
	export type LangOption =
		| 'en-US'
		| 'zh-CN';
	export interface Config {
		lang: LangOption;
	}
	export interface Env {
		version: string;
		defaultLang: LangOption;
	}
}
/**检查 {@link env|`env`} 类型是否正确 */
env as env.Env;


export function getEnumText<T extends getEnumText.EnumName>(type: T, name: getEnumText.EnumMap[T]) {
	const nameObj = getEnumText.obj[type][name];
	return nameObj[env.config.lang] ?? nameObj[env.defaultLang];
}
export namespace getEnumText {
	export type EnumMap = {
		NType: NType;
		EType: EType;
	};
	export type EnumName = keyof EnumMap;
	type Obj = {
		[K in EnumName]: {
			[I in EnumMap[K]]:
			& { [env.defaultLang]: string; }
			& { [J in Exclude<env.LangOption, typeof env.defaultLang>]?: string };
		};
	};
	export const obj: Obj = {
		NType: {
			[NType.System]: {
				'zh-CN': '指令系统',
			},
			[NType.CodeBlock]: {
				'zh-CN': '代码块',
			},
			[NType.Command]: {
				'zh-CN': '单命令',
			},
			[NType.ExpressionCommand]: {
				'zh-CN': '有条件命令方块',
			},
			[NType.Branch]: {
				'zh-CN': '条件分支',
			},
		},
		EType: {
			[EType.ErrNoSuchFile]: {
				'zh-CN': '找不到文件',
				'en-US': 'Cannot find such file',
			},
			[EType.ErrNoParser]: {
				'zh-CN': '没有可用的解析器',
				'en-US': 'No available parser',
			},
			[EType.ErrNoSuchErr]: {
				'zh-CN': '没有这种错误类型',
				'en-US': 'Wrong error type',
			},
			[EType.ErrCannotBeImported]: {
				'zh-CN': '此模块不允许被引入',
				'en-US': 'The module is not allowed to be imported',
			},
			[EType.ErrUseBeforeDefine]: {
				'zh-CN': '变量在预定义完成前被引用',
			},
			[EType.ErrCannotBeSeted]: {
				'zh-CN': '此变量无法被赋值',
				'en-US': 'The variable is not allowed to be assigned',
			},
			[EType.ErrIllegalParameter]: {
				'zh-CN': '非法的参数',
				'en-US': 'Illegal Parameter given',
			},
		},
	};
}
