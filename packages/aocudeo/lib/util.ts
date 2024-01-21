/**
 * 实用工具
 * @module aocudeo/lib/util
 * @version 1.1.3
 * @license GPL-2.0-or-later
 */
declare module './util';

import { SurePosition } from './position';
import type { Id, MapObj, MayArray } from './types';

export abstract class InitializableMap<K, V> extends Map<K, V> {
	protected abstract initializeValue(): V;
	forceGet(key: K) {
		let value = this.get(key);
		if (value) return value;
		value = this.initializeValue();
		this.set(key, value);
		return value;
	}
}
export class SurePositionMap<K> extends InitializableMap<K, SurePosition> {
	protected initializeValue() {
		return new SurePosition({});
	}
}
export class ArrayMap<K, T> extends InitializableMap<K, T[]> {
	protected initializeValue(): T[] {
		return [];
	}
	push(key: K, ...items: T[]) {
		this.forceGet(key).push(...items);
	}
}
export interface ReadonlyArrayMap<K, T> extends ReadonlyMap<K, readonly T[]> { }

/**错误类型 */
export enum ErrorType {
	/**在 {@link Organizer.start|`Loader.START`} 前插入模块 */
	InsertBeforeStart,
	/**在 {@link Organizer.end|`Loader.END`} 后插入模块 */
	InsertAfterEnd,
	/**出现了环形引用 */
	CircularReference,
	/**加载时仍有被引用的模块未被插入 */
	UnregistedCodeUnits,
}
export class AocudeoError {
	constructor(
		type: ErrorType,
		tracker: Error,
		infos?: any,
	) {
		this.type = ErrorType[type] as keyof typeof ErrorType;
		Object.assign(this, infos);
		this.tracker = tracker;
	}
	readonly type;
	declare readonly tracker;
}
export function throwError(type: ErrorType, tracker: Error, infos?: any): never {
	throw new AocudeoError(type, tracker, infos);
}

export const isArray: (n: any) => n is readonly any[] = Array.isArray;
export function getArray<T>(mayArray: MayArray<T>) {
	return isArray(mayArray) ? mayArray : [mayArray];
}
export function isIdArray(n: MayArray<readonly Id[]>): n is readonly Id[] {
	return typeof n[0] !== 'object';
}
export function mapMapObj<N, K extends Id>(mapObj: MapObj<N, K>, walker: (value: N, id: K) => void) {
	Reflect.ownKeys(mapObj).forEach(id => {
		const n = mapObj[<K>id];
		if (typeof n !== 'undefined') walker(n, <K>id);
	});
}
/**遍历 {@link map} */
export function mapMap<N>(map: MapObj<N> | Map<Id, N>, walker: (value: N, id: Id) => void) {
	map instanceof Map
		? map.forEach(walker)
		: mapMapObj(map, walker);
}
