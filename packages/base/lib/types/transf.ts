/**
 * 转译相关定义模块
 * @module @mcdjs/base/lib/types/transf
 * @version 1.1.1
 * @license GPL-3.0-or-later
 */
declare module './transf';

import { EType, throwErr } from '../errlib';
import { Enum } from './base';
import { NType, NTypeKey } from './nodes';

export const aliasVisitorName = {
	'condition': [
		NType.ConditionCommand,
		NType.ConditionSelector,
	],
	'expression': [
		NType.ExpressionAnd,
		NType.ExpressionNand,
		NType.ExpressionNor,
		NType.ExpressionNot,
		NType.ExpressionOr,
		NType.ExpressionXnor,
		NType.ExpressionXor,
	],
} as const;
/**检查 {@link aliasVisitorName|`aliasName`} 类型是否正确 */
let aliasVisitorNameTest: { [alias: string]: readonly NType[]; } = aliasVisitorName;
export type VisitorName =
	| NTypeKey
	| 'all'
	| keyof typeof aliasVisitorName
	;
function isAlias(n: string): n is keyof typeof aliasVisitorName {
	return Array.isArray((aliasVisitorName as any)[n]);
}
export function getNodesVisited(name: string) {
	if (name === 'all') return Enum.valueOf(NType);
	if (Enum.isKeyOf(NType, name)) return [NType[name]];
	if (isAlias(name)) return aliasVisitorName[name];
	return throwErr(EType.ErrIllegalVisitorName, Error(), name);
}
