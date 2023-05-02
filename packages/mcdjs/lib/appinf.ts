/**
 * 应用包装模块
 * @module mcdjs/lib/appinf
 * @version 1.1.2
 * @license GPL-3.0-or-later
 */
declare module './appinf';

import Temp from './alload';
import { Operator } from './magast';
import transform from './transf';

const globalExcludeKeys: (keyof typeof Temp)[] = [
	'Imp',
	'Types',
	'chCommand',
	'Struct',
];
export function globalify() {
	Object.keys(Temp).forEach(key => {
		if ((globalExcludeKeys as string[]).includes(key)) return;
		(globalThis as any)[key] = (Temp as any)[key];
	});
}

export async function parse(tips: string, fn: () => void | PromiseLike<void>) {
	const operm = new Operator(tips);
	globalify();
	operm.come();
	await fn();
	operm.exit();
	transform(operm);
	return operm.ast;
}
