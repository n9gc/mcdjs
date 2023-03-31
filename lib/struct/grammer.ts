/**
 * 实用语法相关
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
void 0;

namespace McdJSTemp {
	(McdJSTemp as any) = globalThis.McdJSTempGet();
	import CommandRslt = Struct.Types.CommandRslt;
	import Vcb = Struct.Types.Vcb;
	export namespace Struct {
		export class CommandRsltClass implements CommandRslt {
			constructor(
				public index: number,
			) {
			}
		}
	}
	import CRClass = Struct.CommandRsltClass;
	/**开启一个分支结构 */
	export function If(expr: CommandRslt): If.BranchThen;
	export function If(expr: CommandRslt, tdo: Vcb, fdo: Vcb): CommandRslt;
	export function If(...args: [CommandRslt] | [CommandRslt, Vcb, Vcb]) {
		return args.length === 1 ? If.getObj(args[0]) : If.reg(...args);
	}
	export namespace If {
		export interface BranchThen {
			/**若条件满足，则 */
			Then(tdo: Vcb): BranchElse;
		}
		interface BranchElse {
			/**若条件不满足，则 */
			Else(fdo: Vcb): CommandRslt;
		}
		export function reg(expr: CommandRslt, tdo: Vcb, fdo: Vcb) {
			const opering = chCommand.getOperm(Error());
			return new CRClass(opering.api.If(expr.index, tdo, fdo));
		}
		export function getObj(expr: CommandRslt): BranchThen {
			return { Then: tdo => ({ Else: fdo => reg(expr, tdo, fdo) }) };
		}
	}
}
