/**
 * 让你可以瞎写代码模块
 * @module mcdjs/lib/hoaxer
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './hoaxer';
declare global {
	/**
	 * McdJS 全局临时对象
	 * @license GPL-3.0-or-later
	 */
	namespace McdJSTemp {
		var Imp: typeof Index;
	}
	/**
	 * 合并全局临时对象
	 * @license GPL-3.0-or-later
	 */
	function McdJSTempMerge(tempObj: typeof McdJSTemp): void;
}

import * as Index from '.';

export const glo = globalThis;
export default glo;
glo.McdJSTemp = {
	Imp: Index,
} as typeof McdJSTemp;
glo.McdJSTempMerge = (tempObj) => {
	glo.McdJSTemp = Object.assign(tempObj, glo.McdJSTemp);
};
