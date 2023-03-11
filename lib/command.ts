/**
 * 命令集模块
 * @version 0.9.0
 */
declare module "./command";

import type Parser from './parser';

class CommandObj {
	constructor(parser: Parser) {
		this.parser = parser;
	}
	private parser: Parser;
	private push(cmd: string) {
		this.parser.command.push(cmd);
	}
	say(text: string) {
		const cmd = `say ${text}`;
		this.push(cmd);
	}
}
export default CommandObj;
