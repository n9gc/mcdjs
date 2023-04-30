/**
 * 错误类型定义模块
 * @module @mcdjs/base/lib/types/errors
 * @version 1.3.12
 * @license GPL-3.0-or-later
 */
declare module './errors';

import { regEnum } from '../config/text';
import { throwErr } from '../errlib';
import type { Enum } from './base';
import type { Node } from './nodes';

export enum EType {
	ErrNoSuchFile,
	ErrNoParser,
	ErrNoSuchErr,
	ErrCannotBeImported,
	ErrUseBeforeDefine,
	ErrCannotBeSeted,
	ErrIllegalParameter,
	ErrForgetPathInfo,
	ErrIllegalVisitorName,
	ErrNoEnumText,
	ErrUnregisteredEnum,
}
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
export interface Err {
	type: EType;
	tracker: Error;
}
export interface ErrNoSuchFile extends Err {
	type: EType.ErrNoSuchFile;
	files: string[];
}
export interface ErrNoParser extends Err {
	type: EType.ErrNoParser;
}
export interface ErrNoSuchErr extends Err {
	type: EType.ErrNoSuchErr;
	throwTracker: Error;
}
export interface ErrCannotBeImported extends Err {
	type: EType.ErrCannotBeImported;
	module: string;
}
export interface ErrUseBeforeDefine extends Err {
	type: EType.ErrUseBeforeDefine;
	varName: string;
}
export interface ErrCannotBeSeted extends Err {
	type: EType.ErrCannotBeSeted;
	varName: string;
}
export interface ErrIllegalParameter extends Err {
	type: EType.ErrIllegalParameter;
	args: IArguments | readonly any[];
}
export interface ErrForgetPathInfo extends Err {
	type: EType.ErrForgetPathInfo;
	node: Node;
}
export interface ErrIllegalVisitorName extends Err {
	type: EType.ErrIllegalVisitorName;
	name: string;
}
export interface ErrNoEnumText extends Err {
	type: EType.ErrNoEnumText;
	enumDomain: string;
	enumNumber: number;
}
export interface ErrUnregisteredEnum extends Err {
	type: EType.ErrUnregisteredEnum;
	enumObj: Enum;
}
export type AllFnErr =
	| ErrNoSuchFile
	| ErrNoParser
	| ErrNoSuchErr
	| ErrCannotBeImported
	| ErrUseBeforeDefine
	| ErrCannotBeSeted
	| ErrIllegalParameter
	| ErrForgetPathInfo
	| ErrIllegalVisitorName
	| ErrNoEnumText
	| ErrUnregisteredEnum
	;
export type SelErr<T extends EType> = AllFnErr & { type: T; };
export type AllErr = AllFnErr | Err;

export type ArgGetErr<T extends EType> = [type: T, tracker: Error, ...ele: ArgGetErrList[T]];
export type ArgGetErrList = { [I in EType]: Parameters<typeof GetErrFns[I]> };
export const GetErrFns = [
	(files: string[]) => ({ files }),
	() => ({}),
	(throwTracker: Error) => ({ throwTracker }),
	(module: string) => ({ module }),
	(varName: string) => ({ varName }),
	(varName: string) => ({ varName }),
	(args: IArguments | readonly any[]) => ({ args }),
	(node: Node) => ({ node }),
	(name: string) => ({ name }),
	(enumDomain: string, enumNumber: number) => ({ enumDomain, enumNumber }),
	(enumObj: Enum) => ({ enumObj }),
] as const;
export function GetErr<B extends EType>(...pele: ArgGetErr<B>) {
	const [type, tracker, ...args] = pele;
	if (type in GetErrFns) return {
		type,
		...(GetErrFns[type] as any)(...args),
		tracker,
	} as SelErr<B>;
	return throwErr(EType.ErrNoSuchErr, pele[1], Error());
}
