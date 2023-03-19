/**
 * 命令集初始化
 * @version 0.1.2
 * @license GPL-3.0-or-later
 */
void 0;

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	type Parser = import('../parser').default;
	const _parsers: Parser[] = [];
	const errlib = McdJSTemp.Imp.errlib;
	function testIdx<T>(tracker: Error, n?: T) {
		if (!n) return errlib.throwErr(errlib.EType.ErrNoParser, tracker);
		else return n;
	}
	/**McdJS 命令集 */
	export namespace Command {
		/**版本信息 */
		export namespace Ver {
			export const base = '1.0.0';
		}
	}
	/**命令集间接操作相关 */
	export namespace chCommand {
		export const parsers = _parsers;
		export let parserNow = parsers[0];
		export function come(parser: Parser) {
			parsers.push(parserNow = parser);
		}
		export function exit() {
			testIdx(Error(), parsers.pop());
			parserNow = parsers.at(-1)!;
		}
	}
}
