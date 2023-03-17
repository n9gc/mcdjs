/**
 * 全局定义模块
 * @module mcdjs/lib/glodef
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
declare module './glodef';
declare global {
	/**
	 * 命令集间接操作相关
	 * @license GPL-3.0-or-later
	 */
	namespace chCommand {
		function come(parser: Parser): void;
		function exit(): void;
		function merge(space: typeof Command): void;
		const parsers: Parser[];
		const parserNow: Parser;
	}
}

import type Parser from './parser';
export type Global = typeof globalThis;
export function out<K extends keyof Global, T extends Global[K]>(key: K, obj: T) {
	return globalThis[key] = obj;
}
export default out;
