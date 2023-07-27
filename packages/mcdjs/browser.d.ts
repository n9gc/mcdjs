/**
 * McdJS 浏览器
 * @license GPL-2.0-or-later
 */
declare module './browser';
declare global {
	namespace globalThis {
		export import McdJS = mcdjs;
	}
}

import * as mcdjs from '.';
