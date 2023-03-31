/**
 * McdJS 全局定义
 * @license GPL-3.0-or-later
 */
declare module './global';
declare global {
	namespace globalThis {

		// 结构
		export import Command = McdJSTemp.Command;

		// 实用工具
		export import tip = McdJSTemp.tip;
		export import If = McdJSTemp.If;

	}
}

import '.';
