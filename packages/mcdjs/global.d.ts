/**
 * McdJS 全局定义
 * @license GPL-2.0-or-later
 */
declare module './global';
declare global {

	// cmdobj
	var Command: Api['Command'];

	// grammer
	var If: Api['If'];

	// static
	namespace globalThis {
		export import CommandRsltClass = static.CommandRsltClass;
		export import SelectedClass = static.SelectedClass;
		export import Tag = static.Tag;
		export import AND = static.AND;
		export import OR = static.OR;
		export import NOT = static.NOT;
		export import NAND = static.NAND;
		export import NOR = static.NOR;
		export import XOR = static.XOR;
		export import XNOR = static.XNOR;
		export import and = static.and;
		export import or = static.or;
		export import not = static.not;
		export import nand = static.nand;
		export import nor = static.nor;
		export import xor = static.xor;
		export import xnor = static.xnor;
		export import select = static.select;
	}

	// util
	var tip: Api['tip'];

}

import { Api } from './lib/api';
import * as static from './lib/api/static';

