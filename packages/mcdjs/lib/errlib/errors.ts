/**
 * 错误类型定义模块
 * @module mcdjs/lib/errlib/errors
 * @version 1.4.1
 * @license GPL-3.0-or-later
 */
declare module './errors';

import { regEnum } from '../config/text';
import { throwErr } from '../errlib';
import type { Node } from '../magast/nodes';
import { Enum } from '../types/base';
import type { KeyArrayOf } from '../types/tool';

export const errs = {
	ErrNoSuchFile: (files: string[]) => ({
		files,
	}),
	ErrNoParser: () => ({}),
	ErrNoSuchErr: (throwTracker: Error) => ({
		throwTracker,
	}),
	ErrCannotBeImported: (moduleName: string) => ({
		moduleName,
	}),
	ErrUseBeforeDefine: (varName: string) => ({
		varName,
	}),
	ErrCannotBeSeted: (varName: string) => ({
		varName,
	}),
	ErrIllegalParameter: (args: IArguments | readonly any[]) => ({
		args,
	}),
	ErrForgetPathInfo: (node: Node) => ({
		node,
	}),
	ErrIllegalVisitorName: (name: string) => ({
		name,
	}),
	ErrNoEnumText: (enumDomain: string, enumNumber: number) => ({
		enumDomain,
		enumNumber,
	}),
	ErrUnregisteredEnum: (enumObj: Enum) => ({
		enumObj,
	}),
} as const;
export const EType = Enum.from(Object.keys(errs) as KeyArrayOf<typeof errs>);
export type ETypeKey = Enum.KeyOf<typeof EType>;
export type EType<K extends ETypeKey = ETypeKey> = Enum.ValueOf<typeof EType, K>;
export const tranumEType = regEnum('EType', EType, {
	ErrNoSuchFile: {
		'zh-CN': '找不到文件',
		'en-US': 'Cannot find such file',
	},
	ErrNoParser: {
		'zh-CN': '没有可用的解析器',
		'en-US': 'No available parser',
	},
	ErrNoSuchErr: {
		'zh-CN': '没有这种错误类型',
		'en-US': 'Wrong error type',
	},
	ErrCannotBeImported: {
		'zh-CN': '此模块不允许被引入',
		'en-US': 'The module is not allowed to be imported',
	},
	ErrUseBeforeDefine: '变量在预定义完成前被引用',
	ErrCannotBeSeted: {
		'zh-CN': '此变量无法被赋值',
		'en-US': 'The variable is not allowed to be assigned',
	},
	ErrIllegalParameter: {
		'zh-CN': '非法的参数',
		'en-US': 'Illegal Parameter given',
	},
	ErrForgetPathInfo: {
		'zh-CN': '初始化节点时未注册路径信息',
		'en-US': 'Forget to regist PathInfo when initialize a Node',
	},
	ErrIllegalVisitorName: {
		'zh-CN': '错误的访问器名称',
		'en-US': 'Illegal vistor name',
	},
	ErrNoEnumText: '找不到枚举对应的文本',
	ErrUnregisteredEnum: '使用了未被注册的枚举',
});
export interface ErrBase {
	type: EType;
	tracker: Error;
}
export type Err<T extends EType = any> = ReturnType<typeof errs[typeof EType[T]]> & ErrBase;

export type ArgGetErr<T extends EType> = [type: T, tracker: Error, ...ele: ArgGetErrList[T]];
export type ArgGetErrList = { [I in EType]: Parameters<typeof errs[typeof EType[I]]> };
export function GetErr<B extends EType>(...pele: ArgGetErr<B>) {
	const [type, tracker, ...args] = pele;
	const typeName = EType[type];
	if (!(typeName in EType)) return throwErr(EType.ErrNoSuchErr, pele[1], Error());
	const fn = errs[typeName] as (...n: typeof args) => Omit<Err<B>, keyof ErrBase>;
	return {
		type,
		...fn(...args),
		tracker,
	} as Err<B>;
}
