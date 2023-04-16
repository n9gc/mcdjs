/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 3.0.0
 * @license GPL-3.0-or-later
 */
declare module '.';
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

import * as Index from '..';
import * as Types from '../types';
import ChainList from './chainlist';
import glo = globalThis;

glo.McdJSTemp = {
	Imp: Index,
	Types,
} as typeof McdJSTemp;
glo.McdJSTempGet = () => glo.McdJSTemp;

export import Temp = glo.McdJSTemp;
export default new ChainList;
