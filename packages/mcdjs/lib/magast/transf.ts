/**
 * 转译相关定义模块
 * @module mcdjs/lib/magast/transf
 * @version 2.2.0
 * @license GPL-3.0-or-later
 */
declare module './transf';

import { EType, throwErr } from '../errlib';
import { Enum, listKeyOf } from '../types/base';
import { AnyArr, InArr } from '../types/tool';
import { NType, NTypeKey } from './nodes';
import PathInfo from './pathinfo';

namespace Alias {
	function con<T extends AnyArr>(...n: [...T]): Readonly<T> {
		return n;
	}
	export const condition = con(
		NType.ConditionCommand,
		NType.ConditionSelector,
	);
	export const expressionCalcSig = con(
		NType.ExpressionNot,
	);
	export const expressionCalcBin = con(
		NType.ExpressionAnd,
		NType.ExpressionNand,
		NType.ExpressionNor,
		NType.ExpressionOr,
		NType.ExpressionXnor,
		NType.ExpressionXor,
	);
	export const expressionCalc = con(
		...expressionCalcBin,
		...expressionCalcSig,
	);
	export const expression = con(
		...expressionCalc,
		NType.SimData,
	);
}
export type Alias = keyof typeof Alias;
const aliasList = listKeyOf(Alias);
function isAlias(n: string): n is Alias {
	return aliasList.includes(n as any);
}
export function getNodesVisited(name: string) {
	if (name === 'all') return Enum.valueOf(NType);
	if (Enum.isKeyOf(NType, name)) return [NType[name]];
	if (isAlias(name)) return Alias[name];
	return throwErr(EType.ErrIllegalVisitorName, Error(), name);
}

export type VisitorName =
	| NTypeKey
	| 'all'
	| Alias
	;

export interface VisitorFn<T extends NType = NType> {
	(pathInfo: PathInfo<T>): void;
}
export interface VisitorObj<T extends NType = NType> {
	entry?: VisitorFn<T>;
	exit?: VisitorFn<T>;
}
export type Visitor<T extends NType = NType> = VisitorObj<T> | VisitorFn<T>;
export type VisitorNType<T extends VisitorName> = T extends NTypeKey ? NType<T> : T extends Alias ? InArr<typeof Alias[T]> : EType;
export type Plugin = {
	[I in VisitorName]?: Visitor<VisitorNType<I>>;
};

class VisitorFns {
	entrys: VisitorFn[] = [];
	exits: VisitorFn[] = [];
	add({ entry, exit }: VisitorObj) {
		entry && this.entrys.push(entry);
		exit && this.entrys.push(exit);
	}
}
export class PluginEmiter {
	constructor(mod: Plugin) {
		for (const name in mod) {
			const now = (mod as any)[name] as Visitor;
			const obj = typeof now === 'function' ? { entry: now } : now;
			getNodesVisited(name).forEach(n => this.addMap(n, obj));
		}
	}
	protected map: { [I in NType]?: VisitorFns } = {};
	protected addMap(n: NType, obj: VisitorObj) {
		(this.map[n] || (this.map[n] = new VisitorFns)).add(obj);
	}
	entry(n: NType, pathInfo: PathInfo) {
		this.map[n]?.entrys.forEach(fn => fn(pathInfo));
	}
	exit(n: NType, pathInfo: PathInfo) {
		this.map[n]?.exits.forEach(fn => fn(pathInfo));
	}
}
