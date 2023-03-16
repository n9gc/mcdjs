/**McdJS 命令集 */
namespace Command {
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
			Object.assign(Command, space);
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
