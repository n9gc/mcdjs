/**
 * McdJS 全局定义
 * @license GPL-3.0-or-later
 */
declare module './global';
declare global {
	namespace globalThis {

		// lib/cmdobj
		export import Command = McdJSTemp.Command;

		// lib/struct/grammer
		export import AND = McdJSTemp.AND;
		export import OR = McdJSTemp.OR;
		export import NOT = McdJSTemp.NOT;
		export import NAND = McdJSTemp.NAND;
		export import NOR = McdJSTemp.NOR;
		export import XOR = McdJSTemp.XOR;
		export import XNOR = McdJSTemp.XNOR;
		export import Tag = McdJSTemp.Tag;
		export import If = McdJSTemp.If;
		export import When = McdJSTemp.When;
		export import select = McdJSTemp.select;

		// lib/struct/util
		export import tip = McdJSTemp.tip;

	}
}

import '.';
