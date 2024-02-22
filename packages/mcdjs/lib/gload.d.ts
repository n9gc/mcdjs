/**
 * 库注入相关全局配置
 * @module mcdjs/lib/gload
 * @version 1.1.0
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
        namespace libs { }
        /**订阅的生成事件 */
        namespace genevents { }
    }
}
export import Port = globalThis.McdJSPort;
