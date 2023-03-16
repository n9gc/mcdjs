/**
 * 全局解析器模块
 * @module mcdjs/lib/parser
 * @version 0.10.0
 * @license GPL-3.0-or-later
 */
declare module './parser';

import { Types } from './config';
import { chCommand } from './command';

export default class Parser {
	constructor(context: string, fileInfo: Types.FileParsed = {}) {
		this.context = context;
		this.fileInfo = fileInfo;
		fileInfo[context] = this.commands;
		this.come();
	}
	come() {
		chCommand.come(this);
		return this;
	}
	exit() {
		chCommand.exit();
		return this;
	}
	context: string;
	commands: Types.Commands = [];
	fileInfo: Types.FileParsed;
	head = true;
	push(code: string, con = false) {
		this.commands.push({
			code,
			type: this.head
				? (this.head = false, Types.CbType.Impulse)
				: Types.CbType[con ? 'Chain' : 'ChainCon']
		});
	}
}
