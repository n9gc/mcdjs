import type test from 'tape';
import {
	ErrorType,
	Id,
	MapObj,
	Organizer,
	Position,
	PositionObj,
	SurePosition
} from '..';

export interface AddonFn {
	(t: test.Test): void;
}

/**以数组为输入制作 {@link Map} */
export function mm<K extends Id, V>(mapObj: false, kv: Iterable<readonly [K, V]>): Map<K, V>;
/**以数组为输入制作{@link MapObj|映射对象} */
export function mm<K extends Id, V>(mapObj: true, kv: Iterable<readonly [K, V]>): MapObj<V, K>;
export function mm<K extends Id, V>(mapObj: boolean, kv: Iterable<readonly [K, V]>) {
	if (!mapObj) return new Map(kv);
	const o: MapObj<V, K> = Object.create(null);
	[...kv].forEach(([k, v]) => o[k] = v);
	return o;
}
/**快捷用 {@link Position} 输入来创造一个 {@link SurePosition} 输出 */
export function ti(i: Position) {
	return new SurePosition(new PositionObj(i));
}
/**把 {@link Map} 改成{@link MapObj|映射对象} */
export function cma<T>(j: Map<Id, T>) {
	const sm: { [x: Id]: T; } = Object.create(null);
	j.forEach((i, s) => sm[s] = i);
	return sm;
}
/**创造一个只用于标记的{@link MapObj|映射对象} */
export function gsm<T>(k: Iterable<Id>, s: T) {
	const sm: { [x: Id]: T; } = Object.create(null);
	[...k].forEach(id => sm[id] = s);
	return sm;
}
/**{@link Organizer.start|开头标记}和{@link Organizer.end|结束标记} */
export const se = [Organizer.start, Organizer.end] as const;
/**给数组的开头添加{@link Organizer.start|开头标记}和{@link Organizer.end|结束标记} */
export function pse(i: Id[]) {
	return [...se, ...i];
}
/**展开 {@link A} 和 {@link B} 并合并 */
export function m<A extends {}, B extends {}>(a: A, b: B) {
	return { ...a, ...b };
}
/**@borrows {@link Reflect.ownKeys} */
export function k(o: {}) {
	return Reflect.ownKeys(o);
}
/**用数组元素创造一个只用于标记的{@link MapObj|映射对象} */
export function car(a: Iterable<Id>) {
	return gsm(a, 0 as 0);
}
/**判断是否不为 `undefined` */
function nu<T>(n: T): n is T extends undefined ? never : T {
	return typeof n !== 'undefined';
}
/**用于{@link MapObj|映射对象}的 {@link Array.map} 方法 */
export function mmo<N, T>(o: MapObj<N>, w: (value: N, id: Id) => T) {
	return mm(true, Reflect.ownKeys(o).map(id => {
		const n = o[id];
		return typeof n !== 'undefined' ? [id, w(n, id)] as [Id, T] : void 0;
	}).filter(nu));
}
/**把 {@link Id} 数组变成集合，并加上{@link Organizer.end|结束标记}的空集合 */
export function nem(liv: [Id, Id[]?][]) {
	const j = liv.map(([i, is = []]) => [i, new Set(is)] as const);
	j.push([Organizer.end, new Set()]);
	return j;
}
/**延时 t 毫秒 */
export function to(t: number) {
	return new Promise<void>(res => setTimeout(res, t));
}
/**创造一个工具函数，无参数调用时把之前的参数以数组形式返回 */
export function msf() {
	const s: Id[] = [];
	return (i?: Id) => () => (typeof i !== 'undefined' && s.push(i), s);
}
/**打乱数组 */
export function ra<T>(a: readonly T[]) {
	const r = a.slice();
	for (let i = 1; i < r.length; i++) {
		const rd = Math.floor(Math.random() * (i + 1));
		[r[i], r[rd]] = [r[rd], r[i]];
	}
	return r;
}
/**代为运行函数并处理抛出的问题 */
export function aeh(fn: () => void) {
	return () => {
		try { fn(); }
		catch (err: any) {
			err = { ...err };
			// 翻译错误类型
			err.type = ErrorType[err.type];
			// 删除多余追踪信息
			delete err.tracker;
			// 把数组变成集合
			if ('list' in err) err.list = new Set(err.list);
			if ('circle' in err) err.circle = new Set(err.circle);
			throw err;
		}
	};
}
/**按顺序用 c 中的字符串抵消 m 中的。若 m 中的包含 c 中的则抵消成功。
 *
 * 返回 rc 是不能用来抵消的， rm 是未被抵消的 */
export function csz(m: string[], c: string[]) {
	const rc: string[] = [];
	for (const i of c) {
		const l: string[] = [];
		let f = false;
		for (const j of m)
			f || !j.includes(i)
				? l.push(j)
				: f = true;
		if (!f) rc.push(i);
		m = l;
	}
	return { rc, rm: m };
}
/**就像 Python 的 `range` 一样 */
export function range(stop: number): number[];
export function range(start: number, stop: number): number[];
export function range(start: number, stop: number, step: number): number[];
export function range(a: number, b: number | null = null, c: number = 1) {
	let [start, stop, step] = b === null ? [0, a, 1] : [a, b, c];
	return [...function* () { while (start < stop) yield start, start += step; }()];
}
