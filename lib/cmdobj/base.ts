/**
 * 命令集初始化
 * @version 0.1.5
 * @license GPL-3.0-or-later
 */
(McdJSTemp as any) = globalThis.McdJSTempGet();

namespace McdJSTemp {
	import CRClass = Struct.CommandRsltClass;
	import Operm = Imp.magast.Operator;
	const errlib = Imp.errlib;
	function testIdx<T>(n?: T) {
		if (!n) return errlib.throwErr(errlib.EType.ErrNoParser, Error());
		else return n;
	}
	/**
	 * McdJS 命令集
	 * @license GPL-3.0-or-later
	 */
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
		export function getOperm() {
			return testIdx(opering);
		}
		export function insert(cmd: string) {
			const opering = getOperm();
			return new CRClass(opering.insert(cmd));
		}
	}
}
