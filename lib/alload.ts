/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 2.0.0
 * @license GPL-3.0-or-later
 */
declare module './alload';
declare global {
	/**
	 * McdJS 全局临时对象
	 * @license GPL-3.0-or-later
	 */
	namespace McdJSTemp {
		var Imp: typeof Index;
	}
	/**
	 * 得到真正全局临时对象
	 * @license GPL-3.0-or-later
	 */
	function McdJSTempGet(): typeof McdJSTemp;
}

import * as Index from '.';

const glo = globalThis;
glo.McdJSTemp = {
	Imp: Index,
} as typeof McdJSTemp;
glo.McdJSTempGet = () => glo.McdJSTemp;

import './struct';
import './cmdobj';

export default McdJSTemp;
export import Command = McdJSTemp.Command;
export import Struct = McdJSTemp.Struct;
export import chCommand = McdJSTemp.chCommand;
export import Types = Struct.Types;
