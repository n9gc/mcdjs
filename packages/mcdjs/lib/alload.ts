/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 4.2.0
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
	 * 合并全局临时对象
	 * @license GPL-3.0-or-later
	 */
	function McdJSTempMerge(temp: typeof McdJSTemp): void;
}

import Loader from 'aocudeo';
import * as Index from '.';
import * as Types from './types';
import { Vcb } from './types/tool';
import glo = globalThis;

export interface Info extends Loader.Types.PosInfo {
	id: string | symbol;
	act: Vcb;
}

import { infoCmdobj } from './cmdobj/init';
import { infoStruct } from './struct/init';

(() => {
	const infos = [
		infoStruct,
		infoCmdobj,
	];
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
	const loader = new Loader;
	infos.forEach(info => loader.insert(info.id, info, info.act));
	loader.load();
	temps.forEach(n => merge(n, glo.McdJSTemp));
})();

export import Temp = glo.McdJSTemp;
export default Temp;
