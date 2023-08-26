/**
 * 应用包装模块
 * @module mcdjs/lib/appinf
 * @version 1.3.0
 * @license GPL-2.0-or-later
 */
declare module './appinf';

import { Api } from './api';
import generate, { GenerateOption } from './generator';
import { Operator } from './magast';
import transform from './plugin';

export function globalify({ api }: Operator) {
	globalify.methodKeys.forEach(key => (globalThis as any)[key] = function fn(...args: any[]) {
		return this instanceof fn ? new (api as any)[key](...args) : (api as any)[key](...args);
	});
	globalify.attributeKeys.forEach(key => (globalThis as any)[key] = (api as any)[key]);
}
export namespace globalify {
	export const methodKeys = new Set<string>();
	export const attributeKeys = new Set<string>();
	export function Export(proto: any, key: string) {
		(typeof proto[key] === 'function' ? methodKeys : attributeKeys).add(key);
	}
	export function clear() {
		globalify.methodKeys.forEach(key => delete (globalThis as any)[key]);
		globalify.attributeKeys.forEach(key => delete (globalThis as any)[key]);
	}
}

export interface ParseOption extends GenerateOption {
	/**
	 * 是否将 API 放到全局定义域中
	 * @default false
	 */
	globalify?: boolean;
}
export interface ParseFunction {
	(api: Api): void | PromiseLike<any>;
}
export async function parse(tips: string, fn: ParseFunction, option: ParseOption = {}) {
	const operm = new Operator(tips);
	if (option.globalify) globalify(operm);
	await fn(operm.api);
	if (option.globalify) globalify.clear();
	await transform(operm);
	return generate(operm.ast, option);
}
