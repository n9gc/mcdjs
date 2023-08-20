/**
 * 实用功能
 * @module mcdjs/lib/api/util
 * @version 2.0.0
 * @license GPL-2.0-or-later
 */
declare module './util';

import { globalify } from "../appinf";
import type { Operator } from "../magast";
import { Template } from "../types/base";
import clsStatic from './static';
import Export = globalify.Export;

export default class clsUtil extends clsStatic {
	constructor(
		protected readonly opering: Operator,
	) { super(); }
	private tipLast: string[] = [];
	/**提供一个注释 */
	@Export
	tip(...args: Template.ArgsJoin) {
		this.tipLast.push(Template.join(...args));
	}
	getTip() {
		const tip = this.tipLast;
		this.tipLast = [];
		return tip.join('\n');
	};
}
