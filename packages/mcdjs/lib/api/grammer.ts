/**
 * 实用语法相关
 * @module mcdjs/lib/api/grammer
 * @version 3.0.0
 * @license GPL-2.0-or-later
 */
declare module './grammer';

import { globalify } from "../appinf";
import type { Expression } from "../types/game";
import type { Vcb } from "../types/tool";
import clsCmdobj from "./cmdobj";
import Export = globalify.Export;

export default class clsGrammer extends clsCmdobj {
	// export class NameSpace {
	// 	constructor(sign: string, content: Vcb) {
	// 		const opering = chCommand.getOperm();
	// 		this.node = opering.getNode('NameSpace', sign, content);
	// 	}
	// 	protected readonly node;
	// }
	/**开启一个分支结构 */
	@Export
	If(expr: Expression, tdo: Vcb, fdo = (() => { })) {
		const branch = this.opering.getNode('Branch', expr, tdo, fdo);
		return this.opering.push(branch);
	}
	// /**开启半个分支结构 */
	// export function When(expr: If.ArgStable): When.BranchThen;
	// export function When(expr: If.ArgStable, tdo: Vcb): CommandRslt;
	// export function When(...args: When.Args) {
	// 	return When.ori(...args);
	// }
	// export namespace When {
	// 	export type Args = [If.ArgStable] | [If.ArgStable, Vcb];
	// 	export interface BranchThen {
	// 		/**若条件满足，则 */
	// 		Then(tdo: Vcb): CommandRslt;
	// 	}
	// 	export function ori(...args: Args) {
	// 		if (args.length === 2) return If.main(...args, () => { });
	// 		const con = If.getCondition(args[0]);
	// 		return { Then: (tdo: Vcb) => { If.main(con, tdo, () => { }); } };
	// 	}
	// }
}
