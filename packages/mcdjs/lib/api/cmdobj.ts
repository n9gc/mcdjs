/**
 * 命令集模块
 * @module mcdjs/lib/api/cmdobj
 * @version 0.2.1
 * @license GPL-2.0-or-later
 */
declare module './cmdobj';

import { globalify } from "../appinf";
import type { Operator } from "../magast";
import type { CommandRsltClass } from "./static";
import clsUtil from "./util";
import Export = globalify.Export;

export default class clsCmdobj extends clsUtil {
	@Export Command = getCmdobj(this.opering);
}
export function getCmdobj(opering: Operator) {
	function insert(cmd: string) {
		const cmdObj = opering.getNode('Command', cmd);
		return opering.push(cmdObj);
	}
	function say(text: string) {
		const cmd = `say ${text}`;
		return insert(cmd);
	}
	type TagMethod = {
		add: [name: string];
		remove: [name: string];
		list: [];
	};
	function tag<T extends keyof TagMethod>(targets: string, method: T, ...args: TagMethod[T]): CommandRsltClass;
	function tag<T extends keyof TagMethod>(targets: string, method: T, arg = '') {
		const cmd = `tag ${targets} ${method} ${arg}`;
		return insert(cmd);
	}
	return {
		say,
		tag,
	};
}
