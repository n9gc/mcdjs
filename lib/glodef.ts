/**
 * 全局定义模块
 * @module mcdjs/lib/glodef
 * @version 2.0.0
 * @license GPL-3.0-or-later
 */
declare module './glodef';

export const excludeKeys = [
	'Imp',
];
export function globalify() {
	Object.keys(globalThis.McdJSTemp).forEach(key => {
		if (excludeKeys.includes(key)) return;
		(globalThis as any)[key] = (globalThis.McdJSTemp as any)[key];
	});
}
export default globalify;
