/**
 * 实用功能
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
void 0;

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	export namespace Struct {
		export type ArgsJoin = [literals: { raw: readonly string[]; }, ...values: any[]];
		function join(...args: ArgsJoin) {
			const [{ raw }, ...values] = args;
			const outArr: any[] = [];
			values.forEach((n, i) => outArr.push(raw[i], n));
			outArr.push(raw.at(-1));
			return outArr.join('');
		}
		export function setTip(...args: ArgsJoin) {
			tipLast += (tipLast ? '\n' : '') + join(...args);
		}
		let tipLast = '';
		export function getTip() {
			const tip = tipLast;
			tipLast = '';
			return tip;
		};
	}
	export function Tip(...args: Struct.ArgsJoin) {
		Struct.setTip(...args);
	}
}
