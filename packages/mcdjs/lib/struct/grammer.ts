/**
 * 实用语法相关
 * @version 2.0.1
 * @license GPL-2.0-or-later
 */
"use strict";

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	export namespace Struct {
		export class CommandRsltClass implements CommandRslt {
			constructor(
				public readonly index: number,
			) { }
			readonly tid = TypeId.CommandRslt as const;
		}
		export class SelectedClass implements Selected {
			constructor(
				public expr: Expression,
			) { }
			readonly tid = TypeId.Selected as const;
		}
		export let tagExist: { [name: string]: true; } = {};
		/**标签实体 */
		export class Tag implements TGame.SimTag {
			constructor(
				public name = 'ranTag' + Math.floor(Math.random() * 999999),
			) {
				while (name in tagExist) name += '_';
				tagExist[name] = true;
			}
			readonly tid = TypeId.SimTag as const;
			toString() {
				return this.name;
			}
		}
	}
	import TGame = Types.game;
	import TTool = Types.tool;
	import TypeId = TGame.TypeId;
	import CommandRslt = TGame.CommandRslt;
	import Expression = TGame.Expression;
	import SelectString = TGame.SelectString;
	import Selected = TGame.Selected;
	import CRClass = Struct.CommandRsltClass;
	import SEClass = Struct.SelectedClass;
	import Vcb = TTool.Vcb;
	// export class NameSpace {
	// 	constructor(sign: string, content: Vcb) {
	// 		const opering = chCommand.getOperm();
	// 		this.node = opering.getNode('NameSpace', sign, content);
	// 	}
	// 	protected readonly node;
	// }
	export import Tag = Struct.Tag;
	export const AND = 'and';
	export const OR = 'or';
	export const NOT = 'not';
	export const NAND = 'nand';
	export const NOR = 'nor';
	export const XOR = 'xor';
	export const XNOR = 'xnor';
	function binCalcsFn(sign: Expression.OperatorBin, exprs: binCalcsFn.UnlimitedArgs) {
		if (!exprs.length) return errParams(Error(), exprs);
		let sub = exprs.shift()!;
		exprs.forEach(n => sub = [sub, sign, n]);
		return sub;
	}
	namespace binCalcsFn {
		export type Args = [Expression, Expression];
		export type UnlimitedArgs = [Expression, Expression, ...Expression[]];
	}
	export function and(...expr: binCalcsFn.UnlimitedArgs) { return binCalcsFn(AND, expr); }
	export function or(...expr: binCalcsFn.UnlimitedArgs) { return binCalcsFn(OR, expr); }
	export function not(expr: Expression): Expression { return [NOT, expr]; }
	export function nand(...expr: binCalcsFn.Args) { return binCalcsFn(NAND, expr); }
	export function nor(...expr: binCalcsFn.Args) { return binCalcsFn(NOR, expr); }
	export function xor(...expr: binCalcsFn.Args) { return binCalcsFn(XOR, expr); }
	export function xnor(...expr: binCalcsFn.Args) { return binCalcsFn(XNOR, expr); }
	function errParams(tracker: Error, args: IArguments | readonly any[]): never {
		const { errlib: { throwErr, EType } } = Imp;
		return throwErr(EType.ErrIllegalParameter, tracker, args);
	}
	/**开启一个分支结构 */
	export function If(expr: Expression, tdo: Vcb, fdo = (() => { })): CommandRslt {
		const opering = chCommand.getOperm();
		const branch = opering.getNode('Branch', expr, tdo, fdo);
		return new CRClass(opering.push(branch));
	}
	/**有条件地选择实体 */
	export function select(expr: Expression, range?: SelectString): Selected {
		if (range) expr = and(expr, range);
		return new SEClass(expr);
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
