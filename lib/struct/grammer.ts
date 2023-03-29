/**
 * 实用语法相关
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
void 0;

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	import CommandRslt = Struct.Types.CommandRslt;
	import Vcb = Struct.Types.Vcb;
	export namespace Struct {
		export class CommandRsltClass implements CommandRslt {
			constructor(index: number) {
				this.index = index;
			}
			index;
		}
	}
	class BranchDo {
		constructor(expr: CommandRslt) {
			this.expr = expr;
		}
		private expr: CommandRslt;
		private tdos: Vcb[] = [];
		private fdos: Vcb[] = [];
		private clear(n: 'tdos' | 'fdos') {
			return () => this[n].forEach(fn => fn());
		}
		private end() {
			const opering = McdJSTemp.chCommand.getOperm(Error());
			opering.api.If(this.expr.index, this.clear('tdos'), this.clear('fdos'));
		}
		/**若条件满足，则 */
		Then(tdo: Vcb) {
			this.tdos.push(tdo);
			return this;
		}
		/**若条件不满足，则 */
		Else(fdo: Vcb) {
			this.fdos.push(fdo);
			this.end();
		}
	}
	export function If(expr: CommandRslt) {
		return new BranchDo(expr);
	}
}
