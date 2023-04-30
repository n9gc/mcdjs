/**
 * 错误处理模块
 * @module @mcdjs/base/lib/errlib
 * @version 2.0.8
 * @license GPL-3.0-or-later
 */
declare module './errlib';

import env from './config/env';
import { Obj, some, sureObj } from './config/text';
import {
	ArgGetErr,
	EType,
	Err,
	GetErr,
	tranumEType,
} from './types/errors';
import type { Node } from './types/nodes';

export { EType };

let trackerMap: Obj<Error>;
function getTrackerDefault() {
	if (trackerMap) return trackerMap;
	trackerMap = {} as any;
	for (const i in some.tracker) (trackerMap as any)[i] = Error((some.tracker as any)[i]);
	return trackerMap;
}
export function getTracker() {
	if (env.config.track) return Error();
	return sureObj(getTrackerDefault());
}

export interface ClearedErr {
	type: string;
	tracker: Error;
}
export function clearErr(n: Err): ClearedErr {
	return {
		...n,
		type: tranumEType(n.type),
	};
}

export function throwErr<T extends EType>(...ele: ArgGetErr<T>): never;
export function throwErr(err: Err): never;
export function throwErr<T extends EType>(...args: [Err] | ArgGetErr<T>): never {
	const [err] = args;
	if (typeof err !== 'object') return throwErr(GetErr(...args as ArgGetErr<T>));
	const c = clearErr(err);
	console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', c);
	if (typeof globalThis.process?.exit === 'function') process.exit(9);
	else throw c;
}

export const errCatcher = (err: Err) => throwErr(err);

export function trapErr<T extends EType>(rej: (err: Err<T>) => void, ...eles: ArgGetErr<T>) {
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
