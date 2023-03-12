/**
 * 全局解析器模块
 * @module mcdjs/lib/parser
 * @version 0.9.0
 * @license GPL-3.0-or-later
 */
declare module './parser';
declare global {
	var C: CommandObj;
	var Command: CommandObj;
}

import type { Types } from './config';
import CommandObj from './command';

export default class Parser {
	constructor(context: string) {
		this.context = context;
		this.commandObj = new CommandObj(this);
		this.chOpn();
	}
	chOpn() {
		return globalThis.C = globalThis.Command = this.commandObj;
	}
	commandObj: CommandObj;
	context: string;
	command: Types.Command = [];
}
