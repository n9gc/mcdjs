/**
 * 库注入相关全局配置
 * @module mcdjs/lib/gload
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './gload';
declare global {
	/**
	 * McdJS 库接口
	 * @license GPL-2.0-or-later
	 */
	namespace McdJSPort {
		/**这个值是 `true` */
		const portable = true;
		/**节点定义 */
		namespace Node { }
		/**被挂载的库 */
		namespace Lib { }
	}
}

globalThis.McdJSPort = {
	portable: true,
	Lib: {},
} as typeof McdJSPort;
export import Port = globalThis.McdJSPort;
