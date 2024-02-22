/**
 * 功能无关类型定义模块
 * @module mcdjs/lib/types/base
 * @version 1.5.1
 * @license GPL-2.0-or-later
 */
declare module './base';
import type { AnyArr, Ased, BInT, KeyArrayOf, MapOfArray, RevedObj } from './tool';
export type Lang = 'en-US' | 'zh-CN';
export declare function listKeyOf<T extends {}>(n: T): Readonly<KeyArrayOf<T>>;
export type Enum = Enum.Enum;
export declare namespace Enum {
    /**枚举 */
    export interface Enum {
        [key: number | string]: number | string;
    }
    type StrKeyOf<B> = BInT<keyof B, string>;
    type ExtedKeyOf<B, V, K extends keyof B> = K extends K ? B[K] extends V ? K : never : never;
    /**枚举的键 */
    export type KeyOf<B extends Enum, V extends ValueOf<B> = ValueOf<B>> = ExtedKeyOf<B, V, StrKeyOf<B>>;
    export function keyOf<T extends Enum>(which: T): ExtedKeyOf<T, BInT<T[BInT<keyof T, string>], number>, BInT<keyof T, string>>[];
    /**枚举的值 */
    export type ValueOf<B extends Enum, K extends StrKeyOf<B> = StrKeyOf<B>> = Ased<number, B[K]>;
    export function valueOf<T extends Enum>(which: T): BInT<T[BInT<keyof T, string>], number>[];
    /**根据 {@link T} 生成类似枚举的对象 */
    export type From<T extends AnyArr<string>> = Readonly<RevedObj<MapOfArray<T>> & MapOfArray<T>>;
    export function from<T extends AnyArr<string>>(keys: T): Readonly<import("./tool").InterOfUnion<BInT<import("./tool").Instr<BInT<keyof T, `${number}`>, number>, string | number> extends infer T_1 ? T_1 extends BInT<import("./tool").Instr<BInT<keyof T, `${number}`>, number>, string | number> ? T_1 extends T_1 ? { [I in MapOfArray<T>[T_1]]: T_1; } : never : never : never> & MapOfArray<T>>;
    export function isKeyOf<T extends Enum>(which: T, n: string): n is KeyOf<T>;
    export function mapIn<T extends Enum, R>(which: T, cb: (value: ValueOf<T>, key: KeyOf<T>) => R): R[];
    export {};
}
export declare abstract class InitializableMap<K, V> extends Map<K, V> {
    protected abstract initializeValue(): V;
    forceGet(key: K): V;
}
export declare class ArrayMap<K, T> extends InitializableMap<K, T[]> {
    protected initializeValue(): T[];
    push(key: K, ...items: T[]): void;
}
export interface ReadonlyArrayMap<K, T> extends ReadonlyMap<K, readonly T[]> {
}
export declare namespace Template {
    type ArgsJoin = [literals: {
        raw: readonly string[];
    }, ...values: any[]];
    function join(...args: ArgsJoin): string;
}
