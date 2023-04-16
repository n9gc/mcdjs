/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 2.2.0
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

export interface Registrar<T> {
	<K extends keyof T>(modName: K, mod: T[K]): Registrar<T[K]>
}
function registrarIniter<N>(dad: N): Registrar<N> {
	return <K extends keyof N>(modName: K, mod: N[K]) => {
		dad[modName] = mod;
		return registrarIniter(mod);
	};
}

export const reger0 = registrarIniter(Index);

export default McdJSTemp;

import './config';
import './struct';
import './cmdobj';

export import Command = McdJSTemp.Command;
export import Struct = McdJSTemp.Struct;
export import chCommand = McdJSTemp.chCommand;
