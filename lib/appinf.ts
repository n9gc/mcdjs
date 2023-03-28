/**
 * 应用包装模块
 * @module mcdjs/lib/appinf
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
declare module './appinf';

import globalify from './glodef';
import { Operator } from './opnast'

export async function parse(fn: () => void | PromiseLike<void>) {
	const operm = new Operator('main');
	globalify();
	operm.come();
	await fn();
	operm.exit();
	return operm.ast;
}
