/**
 * 应用包装模块
 * @module mcdjs/lib/entry
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './entry';

import Parser from "./parser";

export async function parse(fn: () => void | PromiseLike<void>) {
	const parser = new Parser('main');
	await fn();
	return parser.fileInfo;
}
