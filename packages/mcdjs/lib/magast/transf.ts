/**
 * 转译相关定义模块
 * @module mcdjs/lib/magast/transf
 * @version 2.2.1
 * @license GPL-2.0-or-later
 */
declare module './transf';

import { EType, throwErr } from '../errlib';
import { Enum, listKeyOf } from '../types/base';
import { AnyArr, InArr } from '../types/tool';
import { NType, NTypeKey } from './nodes';
import PathInfo, { Asserts } from './pathinfo';

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
export type VisitedNType<T extends VisitorName> = T extends NTypeKey ? NType<T> : T extends Alias ? InArr<typeof Alias[T]> : NType;
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
export type Plugin = {
	[I in VisitorName]?: Visitor<VisitedNType<I>>;
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
	constructor(mod: Plugin | PluginEmiter) {
		if ('entry' in mod) return mod;
		for (const name in mod) {
			const now = mod[name as VisitorName]!;
			const obj: VisitorObj<any> = typeof now === 'function' ? { entry: now } : now;
			getNodesVisited(name).forEach(n => this.addMap(n, obj));
		}
	}
	protected map: { [I in NType]?: VisitorFns } = {};
	protected addMap(n: NType, obj: VisitorObj) {
		(this.map[n] || (this.map[n] = new VisitorFns)).add(obj);
	}
	entry(path: PathInfo<any, any>) {
		this.map[path.node.ntype as NType]?.entrys.forEach(fn => fn(path));
	}
	exit(path: PathInfo<any, any>) {
		this.map[path.node.ntype as NType]?.exits.forEach(fn => fn(path));
	}
}
