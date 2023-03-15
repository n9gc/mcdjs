/**
 * 全局解析器模块
 * @module mcdjs/lib/parser
 * @version 0.9.0
 * @license GPL-3.0-or-later
 */
declare module './parser';

import type { Types } from './config';
import './command';

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
	command: Types.Command = [];
}
