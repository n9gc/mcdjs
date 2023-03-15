/**
 * *McdJS* - 用 JS 编写你的指令！
 * @module mcdjs
 * @version 0.9.2
 * @license GPL-3.0-or-later
 * @see {@link https://github.com/n9gc/mcdjs 在线代码仓库}
 */
declare module '.';
declare global {
	var McdJS: typeof import('.');
}

import * as Def from '.';
export default Def;
globalThis.McdJS = Def;

export * as config from './config';
export * as parser from './parser';
