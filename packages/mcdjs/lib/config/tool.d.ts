/**
 * 配置相关辅助模块
 * @module mcdjs/lib/config/tool
 * @version 1.0.2
 * @license GPL-2.0-or-later
 */
declare module './tool';
import type * as index from '..';
import type { ArgGetErrList, EType, ETypeKey } from '../errlib/errors';
export declare function getImp(): typeof index;
export declare namespace getImp {
    let Imp: typeof index;
}
export declare function throwErr<T extends ETypeKey>(n: T, tracker: Error, ...args: ArgGetErrList[EType<T>]): never;
