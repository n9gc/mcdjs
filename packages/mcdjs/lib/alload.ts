/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 3.0.2
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

import * as Types from '@mcdjs/base/dist/types';
import * as Index from '.';
import ChainList from 'aocudeo';
import glo = globalThis;

glo.McdJSTemp = {
	Imp: Index,
	Types,
} as typeof McdJSTemp;
glo.McdJSTempGet = () => glo.McdJSTemp;

export import Temp = glo.McdJSTemp;
export default new ChainList;
