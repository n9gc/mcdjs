/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 2.3.0
 * @license GPL-3.0-or-later
 */
declare module './alload';
declare global {
	/**
	 * McdJS 全局临时对象
	 * @license GPL-3.0-or-later
	 */
	namespace McdJSTemp {
		export import Imp = Index;
		export import Types = Imp.types;
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

export default McdJSTemp;

import * as Types from './types';
glo.McdJSTemp.Types = Types;
import './config';
import './struct';
import './cmdobj';

export import Command = McdJSTemp.Command;
export import Struct = McdJSTemp.Struct;
export import chCommand = McdJSTemp.chCommand;
