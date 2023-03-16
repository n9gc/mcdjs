/**
 * McdJS 命令集
 * @license GPL-3.0-or-later
 */
namespace Command {
	/**版本信息 */
	export namespace Ver {
		export const base = '1.0.0';
	}
	type Parser = import('../parser').default;
	type Command = import('../config').Types.Command;
	const parsers: Parser[] = [];
	const err = McdJS.err;
	globalThis.chCommand = {
		come(parser) {
			parsers.push(parser);
		},
		exit() {
			parsers.pop();
		},
		push(cmd: Command) {
			const parser = parsers.at(-1);
			if (!parser) err.throwErr(err.EType.ErrNoParser, Error());
			else parser.command.push(cmd);
		},
		merge(space) {
			globalThis.Command = Object.assign(space, Command);
		},
	};
}
globalThis.Command = Command;
/**修改命令集 */
declare namespace chCommand {
	function come(parser: import('../parser').default): void;
	function exit(): void;
	function push(cmd: string): void;
	function merge(space: typeof Command): void;
}
