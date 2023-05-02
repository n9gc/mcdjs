/**
 * 程序结构工具初始化
 * @module mcdjs/lib/struct/init
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
/// <reference path="./grammer.ts" />
/// <reference path="./util.ts" />
declare module './init';
declare global {
	namespace McdJSTemp {
		/**程序结构工具 */
		namespace Struct {
		}
	}
}

import type { Info } from '../alload';

export const infoStruct: Info = {
	id: 'struct',
	act() {
		require('./grammer');
		require('./util');
	},
};
