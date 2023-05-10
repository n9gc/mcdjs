/**
 * 实用语法相关
 * @version 1.3.0
 * @license GPL-3.0-or-later
 */
"use strict";

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	export namespace Struct {
		export class CommandRsltClass implements CommandRslt {
			constructor(
				public index: number,
			) {
			}
			tid = TypeId.CommandRslt as const;
		}
		export class SelectedClass implements Selected {
			constructor(
				public expr: Expression,
				public range: SelectString,
			) {
			}
			tid = TypeId.Selected as const;
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
			tid = TypeId.SimTag as const;
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
	import Condition = TGame.Condition;
	import CRClass = Struct.CommandRsltClass;
	import SEClass = Struct.SelectedClass;
	import Vcb = TTool.Vcb;
	export import Tag = Struct.Tag;
	function binCalcsFn(sign: Expression.OperatorBin, exprs: binCalcsFn.Args) {
		if (!exprs.length) return errParams(Error(), exprs);
		let sub = exprs.shift()!;
		exprs.forEach(n => sub = [sub, sign, n]);
		return sub;
	}
	namespace binCalcsFn {
		export type Args = [Expression.Calcable, ...Expression.Calcable[]];
	}
	export function and(...expr: binCalcsFn.Args) { return binCalcsFn(AND, expr); }
	export function or(...expr: binCalcsFn.Args) { return binCalcsFn(OR, expr); }
	export function not(expr: Expression.Calcable): Expression.Calcable { return [NOT, expr]; }
	export function nand(...expr: binCalcsFn.Args) { return binCalcsFn(NAND, expr); }
	export function nor(...expr: binCalcsFn.Args) { return binCalcsFn(NOR, expr); }
	export function xor(...expr: binCalcsFn.Args) { return binCalcsFn(XOR, expr); }
	export function xnor(...expr: binCalcsFn.Args) { return binCalcsFn(XNOR, expr); }
	export const AND = 'and';
	export const OR = 'or';
	export const NOT = 'not';
	export const NAND = 'nand';
	export const NOR = 'nor';
	export const XOR = 'xor';
	export const XNOR = 'xnor';
	function errParams(tracker: Error, args: IArguments | readonly any[]): never {
		const { errlib: { throwErr, EType } } = Imp;
		return throwErr(EType.ErrIllegalParameter, tracker, args);
	}
	/**开启一个分支结构 */
	export function If(expr: If.ArgStable): If.BranchThen;
	export function If(expr: If.ArgStable, tdo: Vcb, fdo: Vcb): CommandRslt;
	export function If(...args: If.Args) {
		return If.ori(...args);
	}
	export namespace If {
		export type ArgStable = Expression | Condition;
		export type Args = [ArgStable] | [ArgStable, Vcb, Vcb];
		export function getCondition(n: ArgStable): Condition {
			return (
				n === null ||
				!('tid' in n) ||
				n.tid === TypeId.SimTag
			) ? select(n) : n;
		}
		export interface BranchThen {
			/**若条件满足，则 */
			Then(tdo: Vcb): BranchElse;
		}
		interface BranchElse {
			/**若条件不满足，则 */
			Else(fdo: Vcb): CommandRslt;
		}
		function reg(expr: Condition, tdo: Vcb, fdo: Vcb) {
			const opering = chCommand.getOperm();
			const branch = opering.getCls('Branch', expr, tdo, fdo);
			return new CRClass(opering.push(branch));
		}
		function getObj(expr: Condition): BranchThen {
			return { Then: tdo => ({ Else: fdo => reg(expr, tdo, fdo) }) };
		}
		export function ori(...args: Args) {
			const con = getCondition(args[0]);
			if (args.length === 1) return getObj(con);
			if (args.length === 3) return reg(con, args[1], args[2]);
			return errParams(Error(), args);
		}
	}
	/**开启半个分支结构 */
	export function When(expr: If.ArgStable): When.BranchThen;
	export function When(expr: If.ArgStable, tdo: Vcb): CommandRslt;
	export function When(...args: When.Args) {
		return When.ori(...args);
	}
	export namespace When {
		export type Args = [If.ArgStable] | [If.ArgStable, Vcb];
		export interface BranchThen {
			/**若条件满足，则 */
			Then(tdo: Vcb): CommandRslt;
		}
		export function ori(...args: Args) {
			if (args.length === 2) return If.ori(...args, () => { });
			const con = If.getCondition(args[0]);
			return { Then: (tdo: Vcb) => { If.ori(con, tdo, () => { }); } };
		}
	}
	/**
	 * 有条件地选择实体
	 * @param range 范围，默认为"@e"
	 */
	export function select(expr: Expression, range?: SelectString): Selected;
	/**
	 * 选择实体
	 * @param range 范围，默认为"@e"
	 */
	export function select(range?: SelectString): Selected;
	export function select(...args: select.Args) {
		const [expr, range] = select.getArgs(args);
		return new SEClass(expr, range);
	}
	export namespace select {
		export type Args = [Expression, SelectString?] | [SelectString?];
		export let defaultRange: SelectString = '@e';
		export function getArgs(args: Args): [Expression, SelectString] {
			if (typeof args[0] === 'undefined') return [null, defaultRange];
			if (typeof args[0] === 'object') return [args[0], args[1] ?? defaultRange];
			if (typeof args[0] === 'string') return [null, args[0]];
			return errParams(Error(), args);
		}
	}
}
