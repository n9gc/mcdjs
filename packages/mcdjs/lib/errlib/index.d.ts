/**
 * 错误处理模块
 * @module mcdjs/lib/errlib
 * @version 2.1.0
 * @license GPL-2.0-or-later
 */
declare module '.';
import { ArgGetErr, EType, Err } from './errors';
export { EType };
export declare function getTracker(): Error;
export interface ClearedErr {
    type: string;
    tracker: Error;
}
export declare function clearErr(n: Err): ClearedErr;
export declare function throwErr<T extends EType>(...ele: ArgGetErr<T>): never;
export declare function throwErr(err: Err): never;
export declare const errCatcher: (err: Err) => never;
export declare function trapErr<T extends EType>(rej: (err: Err<T>) => void, ...eles: ArgGetErr<T>): () => void;
export declare function checkHolded(): void;
export type HoldFnObj<T extends keyof any = 'holder'> = {
    [I in T]?: HoldFn | KeyHoldFn<HoldFnObj<T>>;
};
export interface HoldFn {
    (tracker: Error): never;
    (): boolean;
    addKey<K extends keyof any>(n: K): KeyHoldFn<HoldFnObj<K>>;
}
export interface KeyHoldFn<T> {
    (this: T, tracker: Error): never;
    (this: T): boolean;
}
export declare function holdErr<T extends EType>(...args: ArgGetErr<T>): HoldFn;
