/**
 * 配置相关辅助模块
 * @module mcdjs/lib/config/tool
 * @version 1.0.2
 * @license GPL-2.0-or-later
 */
declare module './tool';

import type * as index from '..';
import type { ArgGetErrList, EType, ETypeKey } from '../errlib/errors';

export function getImp() {
	return getImp.Imp || (getImp.Imp = require('..'));
}
export namespace getImp {
	export let Imp: typeof index;
}

export function throwErr<T extends ETypeKey>(n: T, tracker: Error, ...args: ArgGetErrList[EType<T>]) {
	return getImp().errlib.throwErr(getImp().errlib.EType[n], tracker, ...args);
}
