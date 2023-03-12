/**
 * 命令集模块
 * @module mcdjs/lib/command
 * @version 0.9.0
 * @license GPL-3.0-or-later
 */
declare module "./command";

import type Parser from './parser';

export default class CommandObj {
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
