/**
 * 自由奔放地导出模块
 * @module mcdjs/lib/exp
 * @version 1.2.0
 * @license GPL-3.0-or-later
 */
declare module './exp';
declare global {
	var exp: any;
	var McdJS: typeof Index;
}

import * as Index from '.';

exp === false ? globalThis.McdJS = Index : exp.exports = Index;
