/**
 * 类型定义
 * @module aocudeo/lib/types
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './types';

export type MayArray<T> = readonly T[] | T;
/**拦截器 */
export type Judger<T> = (n: T) => boolean;
export type MapLike<T> = Map<Id, T> | MapObj<T>;
/**可挂钩子的标识符类型 */
export type Hookable = string | number;
/**标识符类型 */
export type Id = symbol | Hookable;
export type MapObj<T, K extends Id = Id> = { [I in K]: T | undefined };
