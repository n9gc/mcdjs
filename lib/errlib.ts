/**
 * 错误处理模块
 * @module mcdjs/lib/errlib
 * @version 1.2.0
 * @license GPL-3.0-or-later
 */
declare module './errlib';

import { Text, env } from './config';
import { Node } from './magast';

export enum EType {
	ErrNoSuchFile,
	ErrNoParser,
	ErrNoSuchErr,
	ErrCannotBeImported,
	/**@deprecated */
	ErrUseBeforeDefine,
	ErrCannotBeSeted,
	ErrIllegalParameter,
	ErrForgetPathInfo,
	ErrIllegalVisitorName,
	ErrNoEnumText,
}
Text.regEnum('EType', {
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
	[EType.ErrForgetPathInfo]: {
		'zh-CN': '初始化节点时未注册路径信息',
		'en-US': 'Forget to regist PathInfo when initialize a Node',
	},
	[EType.ErrIllegalVisitorName]: {
		'zh-CN': '错误的访问器名称',
		'en-US': 'Illegal vistor name',
	},
	[EType.ErrNoEnumText]: {
		'zh-CN': '找不到枚举对应的文本',
	},
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
/**@deprecated */
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
	enumDomain: Text.EnumName;
	enumNumber: number;
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
	| never;
export type SelErr<T extends EType> = AllFnErr & { type: T; };
export type AllErr = AllFnErr | Err;

export type ArgGetErr<T extends EType> = [type: T, tracker: Error, ...ele: ArgGetErrList[T]];
export type ArgGetErrList = [
	[files: string[]],
	[],
	[throwTracker: Error],
	[module: string],
	[varName: string],
	[varName: string],
	[args: IArguments | readonly any[]],
	[node: Node],
	[name: string],
	[enumDomain: Text.EnumName, enumNumber: number]
];
export const GetErrFns: { [I in EType]: (...pele: ArgGetErr<I>) => SelErr<I> } = [
	(type, tracker, files) => ({ type, files, tracker }),
	(type, tracker) => ({ type, tracker }),
	(type, tracker, throwTracker) => ({ type, throwTracker, tracker }),
	(type, tracker, module) => ({ type, module, tracker }),
	(type, tracker, varName) => ({ type, varName, tracker }),
	(type, tracker, varName) => ({ type, varName, tracker }),
	(type, tracker, args) => ({ type, args, tracker }),
	(type, tracker, node) => ({ type, node, tracker }),
	(type, tracker, name) => ({ type, name, tracker }),
	(type, tracker, enumDomain, enumNumber) => ({ type, enumDomain, enumNumber, tracker }),
];
export function GetErr<B extends EType>(...pele: ArgGetErr<B>) {
	const [type] = pele;
	if (type in GetErrFns) return GetErrFns[type](...pele);
	return throwErr(EType.ErrNoSuchErr, pele[1], Error());
}

let trackerMap: { [env.defaultLang]: Error; } & { [I in env.OptionalLang]?: Error };
function getTrackerDefault() {
	if (trackerMap) return trackerMap;
	trackerMap = { 'zh-CN': Error() };
	for (const i in Text.some.tracker) (trackerMap as any)[i] = Error((Text.some.tracker as any)[i]);
	return trackerMap;
}
export function getTracker() {
	return env.config.track ? Error() : getTrackerDefault()[env.config.lang] ?? trackerMap[env.defaultLang];
}

export interface ClearedErr {
	type: string;
	tracker: Error;
}
export function clearErr(n: AllErr): ClearedErr {
	return Object.assign(n, {
		type: Text.getEnum('EType', n.type),
	});
}

export function throwErr<T extends EType>(...ele: ArgGetErr<T>): never;
export function throwErr(err: AllErr): never;
export function throwErr<T extends EType>(...args: [AllErr] | ArgGetErr<T>): never {
	const [err] = args;
	if (typeof err !== 'object') return throwErr(GetErr(...args as ArgGetErr<T>));
	const c = clearErr(err);
	console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', c);
	if (typeof globalThis.process?.exit === 'function') process.exit(9);
	else throw c;
}

export const errCatcher = (err: AllErr) => throwErr(err);

export function trapErr<T extends EType>(rej: (err: SelErr<T>) => void, ...eles: ArgGetErr<T>) {
	return () => rej(GetErr(...eles));
}

const holdeds: ((() => never) | void)[] = [];
export function checkHolded() {
	let fn: (() => never) | void;
	while (fn = holdeds.pop(), holdeds.length) fn?.();
}
export function holdErr<T extends EType>(...args: ArgGetErr<T>) {
	const cb = () => {
		clearTimeout(timer);
		throwErr(...args);
	};
	const timer = setTimeout(cb);
	const index = holdeds.push(cb);
	let unend = true;
	return function (this: Node) {
		if (unend) {
			delete holdeds[index];
			clearTimeout(timer);
			delete this.endTimer;
			unend = false;
		};
	};
}
