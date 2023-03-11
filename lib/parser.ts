/**
 * 全局解析器模块
 * @version 0.9.0
 */
declare module './parser';
declare global {
	var C: CommandObj;
	var Command: CommandObj;
}

import CommandObj from './command';

export class Parser {
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
	command: string[] = [];
}
export default Parser;
