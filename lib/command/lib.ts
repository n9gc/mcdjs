/**
 * 命令集通用库
 * @version 0.1.1
 * @license GPL-3.0-or-later
 */
void 0;

namespace Command {
	const Chc = McdTemp.Chc;
	Chc.merge(Command);
	export namespace Ver {
		export const lib = '0.1.1';
	}
	export function say(text: string) {
		const cmd = `say ${text}`;
		const parser = Chc.parserNow;
		parser.push(cmd);
	}
}
