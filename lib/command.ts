/**
 * 命令集
 * @version 0.9.0
 * @license GPL-3.0-or-later
 */
namespace Command {
	const parser: import('./parser').default[] = [];
	globalThis.chCommand = {
		come(op) {
			parser.push(op);
		},
		exit() {
			parser.pop();
		}
	};
	function push(cmd: string) {
		parser[0].command.push(cmd);
	}
	export function say(text: string) {
		const cmd = `say ${text}`;
		push(cmd);
	}
}
globalThis.Command = Command;
/**修改命令集当前的解析器 */
declare namespace chCommand {
	function come(parser: import('./parser').default): void;
	function exit(): void;
}
