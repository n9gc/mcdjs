/**
 * 应用包装模块
 * @module mcdjs/lib/appinf
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
declare module './appinf';

import { Operator } from './genast'

const globalExcludeKeys = [
	'Imp',
];
export function globalify() {
	Object.keys(globalThis.McdJSTemp).forEach(key => {
		if (globalExcludeKeys.includes(key)) return;
		(globalThis as any)[key] = (globalThis.McdJSTemp as any)[key];
	});
}

export async function parse(tips: string, fn: () => void | PromiseLike<void>) {
	const operm = new Operator(tips);
	globalify();
	operm.come();
	await fn();
	operm.exit();
	return operm.ast;
}
