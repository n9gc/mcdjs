/**
 * 命令集初始化
 * @version 0.1.9
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
	export namespace Command {
		export namespace Ver {
			export const base = '1.0.0';
		}
	}
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
			const cmdObj = opering.getCls('Command', cmd);
			return new CRClass(opering.push(cmdObj));
		}
	}
}
