/**
 * 转译相关定义模块
 * @module mcdjs/lib/transf/types
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
declare module './types';

import { EType, throwErr } from '../errlib';
import { NType, NTypeKey, PathInfo, isNType, valueNType } from '../magast';

export interface VisitorFn {
	(pathInfo: PathInfo): void;
}
export interface VisitorObj {
	entry?: VisitorFn;
	exit?: VisitorFn;
}
export type Visitor = VisitorObj | VisitorFn;
export const aliasVisitorName = {
	'condition': [NType.ConditionCommand, NType.ConditionSelector],
} as const;
/**检查 {@link aliasVisitorName|`aliasName`} 类型是否正确 */
let aliasVisitorNameTest: { [alias: string]: readonly NType[]; } = aliasVisitorName;
export type VisitorName = NTypeKey | 'all' | keyof typeof aliasVisitorName;
export type TransfModule = {
	[I in VisitorName]?: Visitor;
};
function isAlias(n: string): n is keyof typeof aliasVisitorName {
	return Array.isArray((aliasVisitorName as any)[n]);
}
export function getNodesVisited(name: string) {
	if (name === 'all') return valueNType;
	if (isNType(name)) return [NType[name]];
	if (isAlias(name)) return aliasVisitorName[name];
	return throwErr(EType.ErrIllegalVisitorName, Error(), name);
}
