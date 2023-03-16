/**
 * 全局解析器模块
 * @module mcdjs/lib/parser
 * @version 0.10.0
 * @license GPL-3.0-or-later
 */
declare module './parser';

import type { Types } from './config';
import { chCommand } from './command';

export default class Parser {
	constructor(context: string) {
		this.context = context;
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
	command: Types.Commands = [];
}
