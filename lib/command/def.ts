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
	function testIdx<T>(tracker: Error, n?: T) {
		if (!n) return err.throwErr(err.EType.ErrNoParser, tracker);
		else return n;
	}
	const chc = globalThis.chCommand = {
		parsers,
		parserNow: parsers[0],
		come(parser) {
			parsers.push(chc.parserNow = parser);
		},
		exit() {
			testIdx(Error(), parsers.pop());
			chc.parserNow = parsers.at(-1)!;
		},
		merge(space) {
			globalThis.Command = Object.assign(space, Command);
		},
	};
}
globalThis.Command = Command;
/**修改命令集 */
declare namespace chCommand {
	type Parser = import('../parser').default;
	type Command = import('../config').Types.Command;
	function come(parser: Parser): void;
	function exit(): void;
	function merge(space: typeof Command): void;
	const parsers: Parser[];
	const parserNow: Parser;
}
