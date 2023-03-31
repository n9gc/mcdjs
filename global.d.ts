/**
 * McdJS 全局定义
 * @license GPL-3.0-or-later
 */
declare module './global';
declare global {
	/**
	 * McdJS 命令集
	 * @license GPL-3.0-or-later
	 */
	var Command: typeof McdJSTemp.Command;
	/**
	 * 命令集间接操作相关
	 * @license GPL-3.0-or-later
	 */
	var chCommand: typeof McdJSTemp.chCommand;
	namespace globalThis {
		/**提供一个注释 */
		var Tip: typeof McdJSTemp.Tip;
		var If: typeof McdJSTemp.If;
	}
}

import '.';
