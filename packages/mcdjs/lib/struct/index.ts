/**
 * 程序结构工具模块
 * @module mcdjs/lib/struct
 * @version 2.0.0
 * @license GPL-3.0-or-later
 */
/// <reference path="./base.ts" />
/// <reference path="./grammer.ts" />
/// <reference path="./util.ts" />
declare module '.';

import * as me from '.';
import loader from '../alload';

export import Temp = globalThis.McdJSTemp;
export import Struct = Temp.Struct;

const ori = {} as typeof me;
loader.insertBefore('pole', 'struct', () => {
	require('./base');
	require('./grammer');
	require('./util');

	const Temp = globalThis.McdJSTemp;
	Object.assign(ori, {
		Temp,
		Struct: Temp.Struct,
	});
}).setGetter(me, ori, [
	'Temp',
	'Struct',
]);

