/**
 * 命令集
 * @version 0.9.0
 * @license GPL-3.0-or-later
 */
namespace Command {
	const parsers: import('./parser').default[] = [];
	const config = McdJS.config;
	globalThis.chCommand = {
		come(parser) {
			parsers.push(parser);
		},
		exit() {
			parsers.pop();
		},
	};
	function push(cmd: string) {
		const parser = parsers.at(-1);
		if (!parser) config.throwErr(config.EType.ErrNoParser, Error());
		else parser.command.push(cmd);
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
