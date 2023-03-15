/**
 * 配置相关
 * @module mcdjs/lib/config
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
declare module './config';

export const env = {
	version: '0.9.0',
} as const;

export namespace Types {
	export type Command = string[];
	export type Mods = 'cli' | 'command' | 'config' | 'hfile' | 'parser';
}
export enum EType {
	ErrNoSuchFile = '找不到文件',
	ErrNoParser = '没有可用的解析器',
	ErrNoSuchErr = '没有这种错误类型',
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
export type AllErr =
	| Err
	| ErrNoSuchFile
	| ErrNoParser
	| ErrNoSuchErr;

export function throwErr<T extends AllErr>(type: T['type'], ...ele: ArgGetErr<T>): never;
export function throwErr<T extends AllErr>(err: T): never;
export function throwErr<T extends AllErr>(n: T['type'] | T, ...ele: [Error?, ...ArgGetErrList[T['type']]]): never {
	if (typeof n === 'string') return throwErr(GetErr(n, ...(ele as ArgGetErr<T>)));
	console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', n);
	globalThis.process?.exit();
	throw n;
}
export const errCatcher = (err: AllErr) => throwErr(err);

export type ArgGetErr<T extends AllErr> = [tracker: Error, ...ele: ArgGetErrList[T['type']]];
export type ArgGetErrList = {
	[EType.ErrNoParser]: [files: string[]];
	[EType.ErrNoSuchFile]: [];
	[EType.ErrNoSuchErr]: [];
};
export function GetErr<T extends AllErr>(type: T['type'], ...pele: ArgGetErr<T>) {
	const [tracker, ...args] = pele;
	switch (type) {
		case EType.ErrNoSuchFile: return { type, files: args[0], tracker } as T;
		case EType.ErrNoParser: return { type, tracker } as T;
		case EType.ErrNoSuchErr: return { type, tracker } as T;
		default: throwErr({ type: EType.ErrNoSuchErr, tracker });
	}
}
export function trapErr<T extends AllErr>(rej: (err: T) => void, type: T['type'], ...eles: ArgGetErr<T>) {
	return () => rej(GetErr(type, ...eles));
}
