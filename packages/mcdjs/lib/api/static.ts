/**
 * 操作器无关API库
 * @module mcdjs/lib/api/static
 * @version 1.0.1
 * @license GPL-2.0-or-later
 */
declare module './static';

import { globalify } from "../appinf";
import { EType, throwErr } from "../errlib";
import {
	TypeId,
	CommandRslt,
	Selected,
	Expression,
	SimTag,
	SelectString,
} from "../types/game";
import * as me from './static';

const noExportList: string[] = [];
function noExport(name: keyof typeof me) {
	noExportList.push(name);
}

noExport('default');
function clsStatic() { }
clsStatic.prototype = me;
export default clsStatic as any as new () => typeof me;

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

noExport('tagExist');
export let tagExist: { [name: string]: true; } = {};
/**标签实体 */
export class Tag implements SimTag {
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

export const AND = 'and';
export const OR = 'or';
export const NOT = 'not';
export const NAND = 'nand';
export const NOR = 'nor';
export const XOR = 'xor';
export const XNOR = 'xnor';

function binCalcsFn(sign: Expression.OperatorBin, exprs: binCalcsFn.UnlimitedArgs) {
	if (!exprs.length) return throwErr(EType.ErrIllegalParameter, Error(), exprs);
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

/**有条件地选择实体 */
export function select(expr: Expression, range?: SelectString): Selected {
	if (range) expr = and(expr, range);
	return new SelectedClass(expr);
}

Object.keys(me)
	.filter(key => !noExportList.includes(key))
	.forEach(key => globalify.Export(me, key));

