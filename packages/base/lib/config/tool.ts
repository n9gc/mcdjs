/**
 * 配置相关辅助模块
 * @module @mcdjs/base/lib/config/tool
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './tool';

import type * as index from '..';
import type { ArgGetErrList, EType } from '../types/errors';

export function getImp() {
	return getImp.Imp || (getImp.Imp = require('..'));
}
export namespace getImp {
	export let Imp: typeof index;
}

export function throwErr<T extends keyof typeof EType>(n: T, tracker: Error, ...args: ArgGetErrList[typeof EType[T]]) {
	return getImp().errlib.throwErr(getImp().errlib.EType[n], tracker, ...args);
}
