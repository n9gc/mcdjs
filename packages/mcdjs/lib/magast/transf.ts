/**
 * 转译相关定义模块
 * @module mcdjs/lib/magast/transf
 * @version 2.3.1
 * @license GPL-2.0-or-later
 */
declare module './transf';

import { EType, throwErr } from '../errlib';
import { ArrayMap, Enum, listKeyOf } from '../types/base';
import type { AnyArr, InArr } from '../types/tool';
import { NType, NTypeKey } from './nodes';
import type PathInfo from './pathinfo';
import { TransfError, TransfSignal } from './util';

namespace Alias {
	function con<T extends AnyArr>(...n: [...T]): Readonly<T> {
		return n;
	}
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
		NType.Selector,
		NType.CommandRslt,
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

export class PluginEmiter {
	static readonly visitorType = ['exit', 'entry'] as const;
	constructor(plugin?: Plugin | PluginEmiter) {
		if (!plugin) return;
		if ('addMap' in plugin) return plugin;
		else {
			for (const name in plugin) {
				const now = plugin[name as VisitorName]!;
				const obj: VisitorObj<any> = typeof now === 'function' ? { entry: now } : now;
				getNodesVisited(name).forEach(n => this.addMap(n, obj));
			}
		}
	}
	protected entryMap = new ArrayMap<NType, VisitorFn>;
	protected exitMap = new ArrayMap<NType, VisitorFn>;
	protected addMap(n: NType, obj: VisitorObj) {
		PluginEmiter.visitorType.forEach(key => obj[key] && this[`${key}Map`].push(n, obj[key]!));
	}
	protected do(way: 'entry' | 'exit', path: PathInfo<any, any>) {
		this[`${way}Map`].get(path.node.ntype)?.forEach(fn => {
			try { fn(path); }
			catch (err: unknown) {
				TransfError.assert(err);
				switch (err.cause.signal) {
					case TransfSignal.Next: return;
				}
			}
		});
	}
	entry(path: PathInfo<any, any>) {
		this.do('entry', path);
	}
	exit(path: PathInfo<any, any>) {
		this.do('exit', path);
	}
	// merge(plugin: Plugin | PluginEmiter) {
	// 	console.log(0, this.entryMap);
	// 	const emiter = new PluginEmiter(plugin);
	// 	PluginEmiter.visitorType.forEach(key => Enum.mapIn(NType, type => this[`${key}Map`].push(type, ...(emiter[`${key}Map`].get(type) || []))));
	// 	console.log(1, this.entryMap);
	// }
}
