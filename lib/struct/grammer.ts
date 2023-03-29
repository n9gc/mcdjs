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
			constructor(index: number) {
				this.index = index;
			}
			index;
		}
	}
	export function If(expr: CommandRslt) {
		return If.getBranchDo(expr);
	}
	export namespace If {
		export type BranchAble = {
			/**若条件满足，则 */
			Then: BranchDo['Then'];
			/**若条件不满足，则 */
			Else: BranchDo['Else'];
		};
		type BranchDoFn = BranchAble & ((tdo: Vcb) => (fdo: Vcb) => void);
		export function getBranchDo(expr: CommandRslt): BranchDoFn {
			const proto = new BranchDo(expr);
			const fn = (tdo: Vcb) => {
				proto.Then(tdo);
				return (fdo: Vcb) => proto.Else(fdo);
			};
			const Obj = {
				Then(tdo: Vcb) {
					proto.Then(tdo);
					return Obj;
				},
				Else(fdo: Vcb) {
					proto.Else(fdo);
				}
			};
			return Object.assign(fn, Obj);
		}
		class BranchDo {
			constructor(expr: CommandRslt) {
				this.expr = expr;
			}
			expr: CommandRslt;
			tdos: Vcb[] = [];
			fdos: Vcb[] = [];
			clear(n: 'tdos' | 'fdos') {
				return () => this[n].forEach(fn => fn());
			}
			end() {
				const opering = chCommand.getOperm(Error());
				opering.api.If(this.expr.index, this.clear('tdos'), this.clear('fdos'));
			}
			Then(tdo: Vcb) {
				this.tdos.push(tdo);
				return this as BranchAble;
			}
			Else(fdo: Vcb) {
				this.fdos.push(fdo);
				this.end();
			}
		}
	}
}
