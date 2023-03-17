/**
 * 『自由奔放地导出，顺便带点类型定义』模块
 * @module mcdjs/lib/exp
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
declare module './exp';
declare global {
	var exp: any;
	var McdJS: typeof Index;
	namespace McdTemp {
		var Imp: typeof Index;
		var Cmd: typeof Command;
		var Chc: typeof chCommand;
	}
}

import * as Index from '.';

exp === false ? globalThis.McdJS = Index : exp.exports = Index;
