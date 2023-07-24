/**
 * 程序结构工具初始化
 * @module mcdjs/lib/struct/init
 * @version 1.1.3
 * @license GPL-2.0-or-later
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

import { organizer } from '../alload';

organizer.addPosition(
	'struct',
	{},
	() => {
		require('./grammer');
		require('./util');
	}
);
