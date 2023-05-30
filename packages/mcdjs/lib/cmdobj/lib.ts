/**
 * 命令集通用库
 * @version 0.1.5
 * @license GPL-2.0-or-later
 */
"use strict";

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	import insert = chCommand.insert;
	import CRClass = Struct.CommandRsltClass;
	export namespace Command {
		export namespace Ver {
			export const lib = '0.1.1';
		}
		export function say(text: string) {
			const cmd = `say ${text}`;
			return insert(cmd);
		}
		type TagMethod = {
			add: [name: string];
			remove: [name: string];
			list: [];
		};
		export function tag<T extends keyof TagMethod>(targets: string, method: T, ...args: TagMethod[T]): CRClass;
		export function tag<T extends keyof TagMethod>(targets: string, method: T, arg = '') {
			const cmd = `tag ${targets} ${method} ${arg}`;
			return insert(cmd);
		}
	}
}
