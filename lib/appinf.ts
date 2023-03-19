/**
 * 应用包装模块
 * @module mcdjs/lib/appinf
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
declare module './appinf';

import Parser from "./parser";
import globalify from './glodef';

export async function parse(fn: () => void | PromiseLike<void>) {
	const parser = new Parser('main');
	globalify();
	await fn();
	return parser.fileInfo;
}
