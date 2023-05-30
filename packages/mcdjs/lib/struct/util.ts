/**
 * 实用功能
 * @version 1.0.3
 * @license GPL-2.0-or-later
 */
"use strict";

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	/**提供一个注释 */
	export function tip(...args: tip.ArgsJoin) {
		tip.setTip(...args);
	}
	export namespace tip {
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
}
