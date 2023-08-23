/**
 * 应用包装模块
 * @module mcdjs/lib/appinf
 * @version 1.2.1
 * @license GPL-2.0-or-later
 */
declare module './appinf';

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

export interface ParseOption {
	globalify: boolean;
}
export async function parse(tips: string, fn: () => void | PromiseLike<void>, option: ParseOption = { globalify: false }) {
	const operm = new Operator(tips);
	if (option.globalify) globalify(operm);
	await fn();
	if (option.globalify) globalify.clear();
	await transform(operm);
	return operm.ast;
}
