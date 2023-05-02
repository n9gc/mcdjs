/**
 * 全局定义加载模块
 * @module mcdjs/lib/alload
 * @version 4.0.0
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

import ChainList, { ErrorType, setErrorHandler } from 'aocudeo';
import * as Index from '.';
import { EType, throwErr } from './errlib';
import * as Types from './types';
import { AnyArr, MayArr } from './types/tool';
import glo = globalThis;

glo.McdJSTemp = {
	Imp: Index,
	Types,
} as typeof McdJSTemp;
glo.McdJSTempGet = () => glo.McdJSTemp;

export import Temp = glo.McdJSTemp;
export default Temp;

setErrorHandler((errorType, ...args) => {
	switch (errorType) {
		case ErrorType.CannotBeSeted: return throwErr(EType.ErrCannotBeSeted, ...args);
		case ErrorType.UseBeforeDefine: return throwErr(EType.ErrUseBeforeDefine, ...args);
		default: return throwErr(EType.ErrNoSuchErr, args[0], Error(`Enum value: ${errorType}`));
	}
});

export interface Info {
	id: string;
	before?: MayArr<string>;
	after?: MayArr<string>;
	act(): void;
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
	infos.forEach(info => {
		const afters = sureArr(info.after).slice();
		const befores = sureArr(info.before).slice();
		afters.length || afters.push('pole');
		befores.length
			? loader.insertBefore(befores[0], info.id, info.act)
			: loader.insertAfter(afters[0], info.id, info.act);
	});
	loader.load();
})();
