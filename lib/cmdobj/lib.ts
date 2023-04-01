/**
 * 命令集通用库
 * @version 0.1.3
 * @license GPL-3.0-or-later
 */
(McdJSTemp as any) = globalThis.McdJSTempGet();

namespace McdJSTemp {
	import insert = chCommand.insert;
	import CRClass = Struct.CommandRsltClass;
	export namespace Command {
		export namespace Ver {
			export const lib = '0.1.1';
		}
		export function say(text: string) {
			const cmd = `say ${text}`;
			return insert(cmd, Error());
		}
		type TagMethod = {
			add: [name: string];
			remove: [name: string];
			list: [];
		};
		export function tag<T extends keyof TagMethod>(targets: string, method: T, ...args: TagMethod[T]): CRClass;
		export function tag<T extends keyof TagMethod>(targets: string, method: T, arg = '') {
			const cmd = `tag ${targets} ${method} ${arg}`;
			return insert(cmd, Error());
		}
	}
}
