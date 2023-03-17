/**
 * McdJS 命令集
 * @license GPL-3.0-or-later
 */
namespace Command {
	McdTemp.Cmd = Command;
	/**版本信息 */
	export namespace Ver {
		export const base = '1.0.0';
	}
	type Parser = import('../parser').default;
	const parsers: Parser[] = [];
	const err = McdTemp.Imp.err;
	function testIdx<T>(tracker: Error, n?: T) {
		if (!n) return err.throwErr(err.EType.ErrNoParser, tracker);
		else return n;
	}
	const chc = McdTemp.Chc = {
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
			McdTemp.Cmd = Object.assign(space, McdTemp.Cmd);
		},
	};
}
