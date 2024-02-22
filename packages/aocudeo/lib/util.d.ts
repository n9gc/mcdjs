/**
 * 实用工具
 * @module aocudeo/lib/util
 * @version 1.1.3
 * @license GPL-2.0-or-later
 */
declare module './util';
import { SurePosition } from './position';
import type { Id, MapObj, MayArray } from './types';
export declare abstract class InitializableMap<K, V> extends Map<K, V> {
    protected abstract initializeValue(): V;
    forceGet(key: K): V;
}
export declare class SurePositionMap<K> extends InitializableMap<K, SurePosition> {
    protected initializeValue(): SurePosition;
}
export declare class ArrayMap<K, T> extends InitializableMap<K, T[]> {
    protected initializeValue(): T[];
    push(key: K, ...items: T[]): void;
}
export interface ReadonlyArrayMap<K, T> extends ReadonlyMap<K, readonly T[]> {
}
/**错误类型 */
export declare enum ErrorType {
    /**在 {@link Organizer.start|`Loader.START`} 前插入模块 */
    InsertBeforeStart = 0,
    /**在 {@link Organizer.end|`Loader.END`} 后插入模块 */
    InsertAfterEnd = 1,
    /**出现了环形引用 */
    CircularReference = 2,
    /**加载时仍有被引用的模块未被插入 */
    UnregistedCodeUnits = 3
}
export declare class AocudeoError {
    constructor(type: ErrorType, tracker: Error, infos?: any);
    readonly type: "InsertBeforeStart" | "InsertAfterEnd" | "CircularReference" | "UnregistedCodeUnits";
    readonly tracker: Error;
}
export declare function throwError(type: ErrorType, tracker: Error, infos?: any): never;
export declare const isArray: (n: any) => n is readonly any[];
export declare function getArray<T>(mayArray: MayArray<T>): readonly T[];
export declare function isIdArray(n: MayArray<readonly Id[]>): n is readonly Id[];
export declare function mapMapObj<N, K extends Id>(mapObj: MapObj<N, K>, walker: (value: N, id: K) => void): void;
/**遍历 {@link map} */
export declare function mapMap<N>(map: MapObj<N> | Map<Id, N>, walker: (value: N, id: Id) => void): void;
