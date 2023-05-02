/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 4.1.0
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

import ChainList from 'aocudeo';
import * as Index from '.';
import * as Types from './types';
import { AnyArr, MayArr, Vcb } from './types/tool';
import glo = globalThis;

glo.McdJSTemp = {
	Imp: Index,
	Types,
} as typeof McdJSTemp;
glo.McdJSTempGet = () => glo.McdJSTemp;

export import Temp = glo.McdJSTemp;
export default Temp;

export interface Info {
	id: string | symbol;
	after?: MayArr<string | symbol>;
	act: Vcb;
}

import { infoCmdobj } from './cmdobj/init';
import { infoStruct } from './struct/init';

(() => {
	const infos = [
		infoStruct,
		infoCmdobj,
	];
	function sureArr<T>(n: MayArr<T> = []): AnyArr<T> {
		return n instanceof Array ? n : [n];
	}
	const loader = new ChainList;
	infos.forEach(info => loader.insert(info, info.id, info.act));
	loader.load();
})();
