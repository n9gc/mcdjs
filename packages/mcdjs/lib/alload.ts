/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 4.1.1
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

import ChainList, { PosInfo } from 'aocudeo';
import * as Index from '.';
import * as Types from './types';
import { Vcb } from './types/tool';
import glo = globalThis;

glo.McdJSTemp = {
	Imp: Index,
	Types,
} as typeof McdJSTemp;
glo.McdJSTempGet = () => glo.McdJSTemp;

export import Temp = glo.McdJSTemp;
export default Temp;

export interface Info extends PosInfo {
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
	const loader = new ChainList;
	infos.forEach(info => loader.insert(info, info.id, info.act));
	loader.load();
})();
