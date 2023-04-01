/**
 * 错误处理模块
 * @module mcdjs/lib/errlib
 * @version 1.2.0
 * @license GPL-3.0-or-later
 */
declare module './errlib';

import { getEnumText } from './config';

export enum EType {
	ErrNoSuchFile,
	ErrNoParser,
	ErrNoSuchErr,
	ErrCannotBeImported,
	/**@deprecated */
	ErrUseBeforeDefine,
	ErrCannotBeSeted,
	ErrIllegalParameter,
}
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
export type AllFnErr =
	| ErrNoSuchFile
	| ErrNoParser
	| ErrNoSuchErr
	| ErrCannotBeImported
	| ErrUseBeforeDefine
	| ErrCannotBeSeted
	| ErrIllegalParameter;
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
];
export const GetErrFns: { [I in EType]: (...pele: ArgGetErr<I>) => SelErr<I> } = [
	(type, tracker, files) => ({ type, files, tracker }),
	(type, tracker) => ({ type, tracker }),
	(type, tracker, throwTracker) => ({ type, throwTracker, tracker }),
	(type, tracker, module) => ({ type, module, tracker }),
	(type, tracker, varName) => ({ type, varName, tracker }),
	(type, tracker, varName) => ({ type, varName, tracker }),
	(type, tracker, args) => ({ type, args, tracker }),
];
export function GetErr<B extends EType>(...pele: ArgGetErr<B>) {
	const [type] = pele;
	if (type in GetErrFns) return GetErrFns[type](...pele);
	return throwErr(EType.ErrNoSuchErr, pele[1], Error());
}
export function trapErr<T extends EType>(rej: (err: SelErr<T>) => void, ...eles: ArgGetErr<T>) {
	return () => rej(GetErr(...eles));
}

export interface ClearedErr {
	type: string;
	tracker: Error;
}
export function clearErr(n: AllErr): ClearedErr {
	return Object.assign(n, {
		type: getEnumText('EType', n.type),
	});
}

export function throwErr<T extends EType>(...ele: ArgGetErr<T>): never;
export function throwErr(err: AllErr): never;
export function throwErr<T extends EType>(...args: [AllErr] | ArgGetErr<T>): never {
	const [err] = args;
	if (typeof err !== 'object') return throwErr(GetErr(...args as ArgGetErr<T>));
	const c = clearErr(err);
	console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', c);
	if (typeof globalThis.process?.exit === 'function') process.exit(err.type + 200);
	else throw c;
}
export const errCatcher = (err: AllErr) => throwErr(err);
