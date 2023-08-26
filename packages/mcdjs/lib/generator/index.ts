/**
 * 指令生成模块
 * @module mcdjs/lib/generator
 * @version 1.0.2
 * @license GPL-2.0-or-later
 */
declare module '.';

import type { ParseOption } from "../appinf";
import { Ast, NType } from "../magast/nodes";
import { CbType } from "../types/game";
import getFormatter, { Formatter, InternalFormatter } from './formatters';
import getGrouper, { Grouper, InternalGrouper } from "./groupers";
import getNoter, { InternalNoter, Noter } from "./noters";

export interface GenerateOption {
	/**
	 * 指令输出的形式
	 * - `"MPText"` 《MC 指令设计》系列教程中所采用的表达方式
	 * - `Formatter` 可自定义的函数
	 * @default "MPText"
	 */
	formatter?: InternalFormatter | Formatter;
	/**
	 * 注释的形式，若为空则使用 {@link formatter} 字段的值
	 * - `"MPText"` 《MC 指令设计》系列教程中所采用的表达方式
	 * - `"Log"` 使用 say 指令说出注释
	 * - `Noter` 可自定义的函数
	 * @default "MPText"
	 */
	noter?: InternalNoter | Noter;
	/**
	 * 分组的形式，若为空则使用 {@link formatter} 字段的值
	 * - `"MPText"` 《MC 指令设计》系列教程中所采用的表达方式
	 * - `"Log"` 使用 say 指令说出注释
	 * - `Noter` 可自定义的函数
	 * @default "MPText"
	 */
	grouper?: InternalGrouper | Grouper;
}
export default async function generate(ast: Ast, option: ParseOption) {
	const formatter = getFormatter(option);
	const noter = getNoter(option);
	const grouper = getGrouper(option);
	const texts: (string | PromiseLike<string>)[] = [];
	ast.nodes.map(node => {
		if (node.ntype !== NType.CBGroup) return;
		texts.push(grouper());
		if (node.tips) texts.push(noter(node.tips));
		let cbTypeFirst = node.repeat ? CbType.Repeat : CbType.Impulse;
		texts.push(...node.cbs.map((cb, idx) => {
			if (cb.ntype !== NType.Command) return '';
			return formatter({
				cbType: idx ? CbType.Chain : cbTypeFirst,
				command: cb.exec,
				conditional: cb.cond,
				delay: idx ? node.tick : 0,
				note: cb.tips ?? '',
				redstone: false,
			});
		}));
	});
	return {
		text: (await Promise.all(texts)).join(''),
		ast,
		tips: ast.tips,
		option,
	};
}
export interface Generated extends ReturnType<typeof generate> { }
