import {
	ErrorType,
	Hookable,
	Id,
	Organizer,
	Position,
	PositionMap,
	PositionObj,
	SignChecker,
	SurePosition,
	WorkerManagerAsync,
	WorkerRunnerAsync,
	WorkerRunnerSync,
} from "..";
import { Diagram } from "../lib/diagram";

type MapObj<T, K extends Id = Id> = { [I in K]: T | undefined };
export class Tsc<I extends Id> extends SignChecker<I> {
	static idv = class extends Tsc<Id> {
		constructor() {
			super();
			this.ensureds.add(Organizer.start).add(Organizer.end);
		}
	};
	get = () => ({
		en: this.ensureds,
		re: this.requireds,
	});
}
export class Tpm extends PositionMap<void> {
	get = () => ({
		spm: this.surePositionMap,
		sc: this.splitedChecker,
		ic: this.insertedChecker,
		cm: this.countMap,
		gc: this.graphCache,
	});
	override insertedChecker = new Tsc.idv();
	protected override splitedChecker = new Tsc<Hookable>();
}
export class Twma<T> extends WorkerManagerAsync<T> {
	get = () => ({
		wm: this.workerMap,
	});
}
export class Twra<T> extends WorkerRunnerAsync<T> {
	get = () => ({
		l: this.limiter,
		wm: this.workerMap,
		mc: this.makeContext.bind(this),
	});
}
export class Twrs<T> extends WorkerRunnerSync<T> {
	get = () => ({
		wm: this.workerMap,
		mc: this.makeContext.bind(this),
	});
}
export function mm<K extends Id, V>(mapObj: false, kv: Iterable<readonly [K, V]>): Map<K, V>;
export function mm<K extends Id, V>(mapObj: true, kv: Iterable<readonly [K, V]>): MapObj<V, K>;
export function mm<K extends Id, V>(mapObj: boolean, kv: Iterable<readonly [K, V]>) {
	if (!mapObj) return new Map(kv);
	const o: MapObj<V, K> = Object.create(null);
	[...kv].forEach(([k, v]) => o[k] = v);
	return o;
}
export function ti(i: Position) {
	return new SurePosition(new PositionObj(i));
}
export function cma<T>(j: Map<Id, T>) {
	const sm: { [x: Id]: T; } = Object.create(null);
	j.forEach((i, s) => sm[s] = i);
	return sm;
}
export function gsm<T>(k: Iterable<Id>, s: T) {
	const sm: { [x: Id]: T; } = Object.create(null);
	[...k].forEach(id => sm[id] = s);
	return sm;
}
export const se = [Organizer.start, Organizer.end] as const;
export function pse(i: Id[]) {
	return [...se, ...i];
}
export function m<A extends {}, B extends {}>(a: A, b: B) {
	return { ...a, ...b };
}
export function k(o: {}) {
	return Reflect.ownKeys(o);
}
export function car(a: Iterable<Id>) {
	return gsm(a, 0);
}
function nu<T>(n: T): n is T extends undefined ? never : T {
	return typeof n !== 'undefined';
}
export function mmo<N, T>(o: MapObj<N>, w: (value: N, id: Id) => T) {
	return mm(true, Reflect.ownKeys(o).map(id => {
		const n = o[id];
		return typeof n !== 'undefined' ? [id, w(n, id)] as [Id, T] : void 0;
	}).filter(nu));
}
export function nem(liv: [Id, Id[]?][]) {
	const j = liv.map(([i, is = []]) => [i, new Set([...is, Organizer.end])] as const);
	j.push([Organizer.end, new Set()]);
	return j;
}
export function to(t: number) {
	return new Promise(res => setTimeout(res, t));
}
export function msf() {
	const s: Id[] = [];
	return (i?: Id) => () => (typeof i !== 'undefined' && s.push(i), s);
}
export function ra<T>(a: readonly T[]) {
	const r = a.slice();
	for (let i = 1; i < r.length; i++) {
		const rd = Math.floor(Math.random() * (i + 1));
		[r[i], r[rd]] = [r[rd], r[i]];
	}
	return r;
}
export function aeh(fn: () => void) {
	return () => {
		try { fn(); }
		catch (err: any) {
			err = { ...err };
			err.type = ErrorType[err.type];
			delete err.tracker;
			if ('list' in err) err.list = new Set(err.list);
			if ('circle' in err) err.circle = new Set(err.circle);
			throw err;
		}
	};
}
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
