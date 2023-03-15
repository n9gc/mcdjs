/**
 * 配置相关
 * @module mcdjs/lib/config
 * @version 1.0.0
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
export enum ErrType {
	NoSuchFile = '找不到文件',
}
export interface Err {
	type: ErrType;
	tracker: Error;
}
export interface ErrNoSuchFile extends Err {
	type: ErrType.NoSuchFile;
	files: string[];
}
export type AllErr = Err | ErrNoSuchFile;
export function throwErr<T extends AllErr>(err: T): never {
	console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', err);
	globalThis.process?.exit();
	throw err;
}
export const errCatcher = (err: AllErr) => throwErr(err);

