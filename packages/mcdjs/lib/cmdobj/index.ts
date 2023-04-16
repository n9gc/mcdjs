/**
 * 命令集模块
 * @module mcdjs/lib/cmdobj
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
/// <reference path="./base.ts" />
/// <reference path="./lib.ts" />
declare module '.';

import * as me from '.';
import loader from '../alload';
import { Temp } from '../struct';

export { Temp };
export import Command = Temp.Command;
export import chCommand = Temp.chCommand;

const ori = {} as typeof me;
loader.insertAfter('struct', 'cmdobj', () => {
	require('./base');
	require('./lib');

	const Temp = globalThis.McdJSTemp;
	Object.assign(ori, {
		Temp,
		Command: Temp.Command,
		chCommand: Temp.chCommand,
	});
}).setGetter(me, ori, [
	'Temp',
	'Command',
	'chCommand',
]);
