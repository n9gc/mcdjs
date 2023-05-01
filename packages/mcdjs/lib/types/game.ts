/**
 * 游戏相关类型定义模块
 * @module mcdjs/lib/types/game
 * @version 1.3.7
 * @license GPL-3.0-or-later
 */
declare module './game';

import { regEnum } from '../config/text';

/**接口标识 */
export enum TypeId {
	CommandRslt,
	Selected,
	SimTag,
}
export const tranumTypeId = regEnum('TypeId', TypeId, {
	CommandRslt: '命令结果表示',
	Selected: '选择器表示',
	SimTag: '标签表示',
});

/**命令方块类型 */
export enum CbType {
	Impulse,
	Chain,
	Repeat,
}
export const tranumCbType = regEnum('CbType', CbType, {
	Impulse: '脉冲',
	Chain: '链式',
	Repeat: '重复',
});

/**命令运行结果 */
export interface CommandRslt {
	index: number;
	tid: TypeId.CommandRslt;
}

export import Sim = Sim.Base;
export import SimTag = Sim.Tag;
export namespace Sim {
	/**形式数据 */
	export interface Base {
		tid: TypeId;
		name: string;
	}

	/**形式标签 */
	export interface Tag extends Base {
		toString(): string;
		tid: TypeId.SimTag;
	}
}

export import Expression = Expression.Any;
export namespace Expression {
	/**单目运算符 */
	export type OperatorSig =
		| '!'
		| 'not'
		;

	/**双目运算符 */
	export type OperatorBin =
		| '&'
		| 'and'
		| '|'
		| 'or'
		| 'nand'
		| 'nor'
		| 'xor'
		| 'xnor'
		;

	/**运算符 */
	export type Operator =
		| OperatorBin
		| OperatorSig
		;

	/**可操作类型 */
	export type Calcable =
		| Sub
		| SimTag
		;

	/**单目表达式 */
	export type SubSig = [OperatorSig, Calcable];

	/**双目表达式 */
	export type SubBin = [Calcable, OperatorBin, Calcable];

	/**子表达式 */
	export type Sub =
		| SubSig
		| SubBin
		;

	/**表达式 */
	export type Any = null | Calcable;
}

export import Selected = Select.Obj;
export import SelectString = Select.At;
/**选择相关 */
export namespace Select {
	/**选择器结果 */
	export interface Obj {
		expr: Expression;
		range: At;
		tid: TypeId.Selected;
	}

	/**选择字符串 */
	export type At =
		| '@r'
		| '@a'
		| '@p'
		| '@s'
		| '@e'
		;
}

/**条件 */
export type Condition = CommandRslt | Selected;
