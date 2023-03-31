/**
 * 错误处理模块
 * @module mcdjs/lib/errlib
 * @version 1.1.6
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

export type ArgGetErr<T extends EType> = [tracker: Error, ...ele: ArgGetErrList[T]];
export type ArgGetErrList = {
	[EType.ErrNoParser]: [];
	[EType.ErrNoSuchFile]: [files: string[]];
	[EType.ErrNoSuchErr]: [throwTracker: Error];
	[EType.ErrCannotBeImported]: [module: string];
	[EType.ErrUseBeforeDefine]: [varName: string];
	[EType.ErrCannotBeSeted]: [varName: string];
	[EType.ErrIllegalParameter]: [args: IArguments | readonly any[]];
};
export function GetErr<B extends EType, T = SelErr<B>>(type: B, ...pele: ArgGetErr<B>) {
	const [tracker, ...args] = pele;
	switch (type) {
		case EType.ErrNoSuchFile: return { type, files: args[0], tracker } as T;
		case EType.ErrNoParser: return { type, tracker } as T;
		case EType.ErrNoSuchErr: return { type, throwTracker: args[0], tracker } as T;
		case EType.ErrCannotBeImported: return { type, module: args[0], tracker } as T;
		case EType.ErrUseBeforeDefine: return { type, varName: args[0], tracker } as T;
		case EType.ErrCannotBeSeted: return { type, varName: args[0], tracker } as T;
		case EType.ErrIllegalParameter: return { type, args: args[0], tracker } as T;
		default: return throwErr(EType.ErrNoSuchErr, tracker, Error());
	}
}
export function trapErr<T extends EType>(rej: (err: SelErr<T>) => void, type: T, ...eles: ArgGetErr<T>) {
	return () => rej(GetErr(type, ...eles));
}

export interface ClearedErr {
	type: string;
	tracker: Error;
}
export function clearErr<T extends AllErr>(n: T): ClearedErr {
	return {
		...n,
		type: getEnumText('EType', n.type),
	};
}

export function throwErr<T extends EType>(type: T, ...ele: ArgGetErr<T>): never;
export function throwErr(err: AllErr): never;
export function throwErr<T extends EType>(n: T | AllErr, ...ele: [Error?, ...ArgGetErrList[T]]): never {
	if (typeof n === 'number') return throwErr(GetErr(n, ...(ele as ArgGetErr<T>)));
	const c = clearErr(n);
	console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', c);
	if (typeof globalThis.process?.exit === 'function') process.exit(n.type + 200);
	else throw c;
}
export const errCatcher = (err: AllErr) => throwErr(err);
