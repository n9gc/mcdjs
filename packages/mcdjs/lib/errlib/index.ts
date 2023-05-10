/**
 * 错误处理模块
 * @module mcdjs/lib/errlib
 * @version 2.1.0
 * @license GPL-3.0-or-later
 */
declare module '.';

import env from '../config/env';
import { Obj, sureObj } from '../config/text';
import {
	ArgGetErr,
	EType,
	Err,
	GetErr,
} from './errors';
import { some, tranumEType } from './text';

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
export type HoldFnObj<T extends keyof any = 'holder'> = { [I in T]?: HoldFn | KeyHoldFn<HoldFnObj<T>> };
export interface HoldFn {
	(tracker: Error): never;
	(): boolean;
	addKey<K extends keyof any>(n: K): KeyHoldFn<HoldFnObj<K>>;
}
export interface KeyHoldFn<T> {
	(this: T, tracker: Error): never;
	(this: T): boolean;
}
function getHoldFn(fn: (n?: Error) => boolean) {
	const rfn = fn as HoldFn;
	rfn.addKey = (n) => function (this: any, k?: Error) {
		return (fn(k) ? (delete this[n], true) : false);
	} as any;
	return rfn;
}
export function holdErr<T extends EType>(...args: ArgGetErr<T>) {
	const cb = () => {
		clearTimeout(timer);
		throwErr(...args);
	};
	const timer = setTimeout(cb);
	const index = holdeds.push(cb);
	let unend = true;
	return getHoldFn((tracker?: Error) => {
		if (tracker) return args[1] = tracker, throwErr(...args);
		if (unend) {
			delete holdeds[index];
			clearTimeout(timer);
			unend = false;
			return true;
		} else return false;
	});
}
