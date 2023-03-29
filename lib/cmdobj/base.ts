/**
 * 命令集初始化
 * @version 0.1.2
 * @license GPL-3.0-or-later
 */
void 0;

namespace McdJSTemp {
	(McdJSTemp as any) = globalThis.McdJSTempGet();
	type Operm = import('../opnast').Operator;
	const errlib = Imp.errlib;
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
		let opering: Operm | null = null;
		export function come(operm: Operm) {
			opering = operm;
		}
		export function exit() {
			opering = null;
		}
		export function getOperm(tracker: Error) {
			return testIdx(tracker, opering);
		}
	}
}
