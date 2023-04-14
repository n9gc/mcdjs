/**
 * *McdJS* - 用 JS 编写你的指令！
 * @module mcdjs
 * @version 0.9.2
 * @license GPL-3.0-or-later
 * @see https://github.com/n9gc/mcdjs 在线代码仓库
 */
declare module '.';

function regerIniter<N>(dad: N) {
	return <K extends keyof D, D = N>(modName: K, mod: D[K]) => {
		(dad as any)[modName] = mod;
		return regerIniter(mod);
	};
}

import * as Imp from '.';
export const reger0 = regerIniter(Imp);
export default Imp;
export * as alload from './alload';
export * as appinf from './appinf';
export * as config from './config';
export * as errlib from './errlib';
export * as magast from './magast';
export * as transf from './transf';
