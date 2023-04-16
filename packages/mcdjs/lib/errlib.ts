/**
 * 错误处理模块
 * @module mcdjs/lib/errlib
 * @version 2.0.2
 * @license GPL-3.0-or-later
 */
declare module './errlib';

import { reger0 } from './alload';
import { Text, env } from './config';
import {
	AllErr,
	ArgGetErr,
	EType,
	GetErr,
	SelErr,
	tranumEType,
} from './types/errors';
import type { Node } from './types/nodes';

reger0('errlib', exports);

export { EType };

let trackerMap: { [env.defaultLang]: Error; } & { [I in env.OptionalLang]?: Error };
function getTrackerDefault() {
	if (trackerMap) return trackerMap;
	trackerMap = { 'zh-CN': Error() };
	for (const i in Text.some.tracker) (trackerMap as any)[i] = Error((Text.some.tracker as any)[i]);
	return trackerMap;
}
export function getTracker() {
	return env.config.track ? Error() : getTrackerDefault()[env.config.lang] ?? trackerMap[env.defaultLang];
}

export interface ClearedErr {
	type: string;
	tracker: Error;
}
export function clearErr(n: AllErr): ClearedErr {
	return Object.assign(n, {
		type: tranumEType(n.type),
	});
}

export function throwErr<T extends EType>(...ele: ArgGetErr<T>): never;
export function throwErr(err: AllErr): never;
export function throwErr<T extends EType>(...args: [AllErr] | ArgGetErr<T>): never {
	const [err] = args;
	if (typeof err !== 'object') return throwErr(GetErr(...args as ArgGetErr<T>));
	const c = clearErr(err);
	console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', c);
	if (typeof globalThis.process?.exit === 'function') process.exit(9);
	else throw c;
}

export const errCatcher = (err: AllErr) => throwErr(err);

export function trapErr<T extends EType>(rej: (err: SelErr<T>) => void, ...eles: ArgGetErr<T>) {
	return () => rej(GetErr(...eles));
}

const holdeds: ((() => never) | void)[] = [];
export function checkHolded() {
	let fn: (() => never) | void;
	while (fn = holdeds.pop(), holdeds.length) fn?.();
}
export function holdErr<T extends EType>(...args: ArgGetErr<T>) {
	const cb = () => {
		clearTimeout(timer);
		throwErr(...args);
	};
	const timer = setTimeout(cb);
	const index = holdeds.push(cb);
	let unend = true;
	return function (this: Node) {
		if (unend) {
			delete holdeds[index];
			clearTimeout(timer);
			delete this.endTimer;
			unend = false;
		};
	};
}
