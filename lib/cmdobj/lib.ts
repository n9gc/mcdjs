/**
 * 命令集通用库
 * @version 0.1.2
 * @license GPL-3.0-or-later
 */
void 0;

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	export namespace Command {
		export namespace Ver {
			export const lib = '0.1.1';
		}
		export function say(text: string) {
			const cmd = `say ${text}`;
			const parser = McdJSTemp.chCommand.parserNow;
			parser.push(cmd);
		}
	}
}
