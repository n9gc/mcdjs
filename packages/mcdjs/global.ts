/**
 * McdJS 全局定义
 * @license GPL-2.0-or-later
 */
declare module './global';
declare global {
	namespace globalThis {

		// lib/cmdobj
		export import Command = Temp.Command;

		// lib/struct/grammer
		export import and = Temp.and;
		export import or = Temp.or;
		export import not = Temp.not;
		export import nand = Temp.nand;
		export import nor = Temp.nor;
		export import xor = Temp.xor;
		export import xnor = Temp.xnor;
		export import AND = Temp.AND;
		export import OR = Temp.OR;
		export import NOT = Temp.NOT;
		export import NAND = Temp.NAND;
		export import NOR = Temp.NOR;
		export import XOR = Temp.XOR;
		export import XNOR = Temp.XNOR;
		export import Tag = Temp.Tag;
		export import If = Temp.If;
		// export import When = Temp.When;
		export import select = Temp.select;

		// lib/struct/util
		export import tip = Temp.tip;

	}
}

import * as mcdjs from '.';
import Temp from './lib/alload';

mcdjs.appinf.globalify();
