/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 4.3.1
 * @license GPL-2.0-or-later
 */
declare module './alload';
declare global {
	/**
	 * McdJS 全局临时对象
	 * @license GPL-2.0-or-later
	 */
	namespace McdJSTemp {
		export import Imp = Index;
		export import Types = Imp.types;
	}
	/**
	 * 合并全局临时对象
	 * @license GPL-2.0-or-later
	 */
	function McdJSTempMerge(temp: typeof McdJSTemp): void;
}

import Organizer from 'aocudeo';
import * as Index from '.';
import * as Types from './types';
import glo = globalThis;

export const organizer = new Organizer;

glo.McdJSTemp = {
	Imp: Index,
	Types,
} as typeof McdJSTemp;
function merge<T extends {}>(a: T, b: T) {
	const prop: PropertyDescriptorMap = {};
	const myKeys = Object.keys(a);
	const keys = Object.keys(b).filter(n => !myKeys.includes(n)) as (keyof T)[];
	keys.forEach(n => prop[n] = {
		get: () => b[n],
		set: (w) => b[n] = w,
		enumerable: true,
		configurable: true,
	});
	Object.defineProperties(a, prop);
	return a;
}
const temps: (typeof McdJSTemp)[] = [];
glo.McdJSTempMerge = (temp) => {
	temps.push(glo.McdJSTemp);
	glo.McdJSTemp = merge(temp, glo.McdJSTemp);
};

export * from './cmdobj/init';
export * from './struct/init';

organizer.execute();
temps.forEach(n => merge(n, glo.McdJSTemp));

export import Temp = glo.McdJSTemp;
export default Temp;
