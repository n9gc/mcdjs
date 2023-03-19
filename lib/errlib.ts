/**
 * 错误处理模块
 * @module mcdjs/lib/errlib
 * @version 1.0.6
 * @license GPL-3.0-or-later
 */
declare module './errlib';

export enum EType {
	ErrNoSuchFile = '找不到文件',
	ErrNoParser = '没有可用的解析器',
	ErrNoSuchErr = '没有这种错误类型',
	ErrCannotBeImported = '此模块不允许被引入',
	ErrUseBeforeDefine = '变量在预定义完成前被引用',
	ErrCannotBeSet = '此变量无法被赋值',
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
}
export interface ErrCannotBeImported extends Err {
	type: EType.ErrCannotBeImported;
	module: string;
}
export interface ErrUseBeforeDefine extends Err {
	type: EType.ErrUseBeforeDefine;
	varName: string;
}
export interface ErrCannotBeSet extends Err {
	type: EType.ErrCannotBeSet;
	varName: string;
}
export type AllErr =
	| ErrNoSuchFile
	| ErrNoParser
	| ErrNoSuchErr
	| ErrCannotBeImported
	| ErrUseBeforeDefine
	| ErrCannotBeSet
	| Err;

export type ArgGetErr<T extends AllErr> = [tracker: Error, ...ele: ArgGetErrList[T['type']]];
export type ArgGetErrList = {
	[EType.ErrNoParser]: [files: string[]];
	[EType.ErrNoSuchFile]: [];
	[EType.ErrNoSuchErr]: [];
	[EType.ErrCannotBeImported]: [module: string];
	[EType.ErrUseBeforeDefine]: [varName: string];
	[EType.ErrCannotBeSet]: [varName: string];
};
export function GetErr<T extends AllErr>(type: T['type'], ...pele: ArgGetErr<T>) {
	const [tracker, ...args] = pele;
	switch (type) {
		case EType.ErrNoSuchFile: return { type, files: args[0], tracker } as T;
		case EType.ErrNoParser: return { type, tracker } as T;
		case EType.ErrNoSuchErr: return { type, tracker } as T;
		case EType.ErrCannotBeImported: return { type, module: args[0], tracker } as T;
		case EType.ErrUseBeforeDefine:
		case EType.ErrCannotBeSet: return { type, varName: args[0], tracker } as T;
		default: throwErr({ type: EType.ErrNoSuchErr, tracker });
	}
}
export function trapErr<T extends AllErr>(rej: (err: T) => void, type: T['type'], ...eles: ArgGetErr<T>) {
	return () => rej(GetErr(type, ...eles));
}

export function throwErr<T extends AllErr>(type: T['type'], ...ele: ArgGetErr<T>): never;
export function throwErr<T extends AllErr>(err: T): never;
export function throwErr<T extends AllErr>(n: T['type'] | T, ...ele: [Error?, ...ArgGetErrList[T['type']]]): never {
	if (typeof n === 'string') return throwErr(GetErr(n, ...(ele as ArgGetErr<T>)));
	console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', n);
	globalThis.process?.exit();
	throw n;
}
export const errCatcher = (err: AllErr) => throwErr(err);

