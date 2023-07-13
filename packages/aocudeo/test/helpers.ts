import {
	Hookable,
	Id,
	Loader,
	Position,
	PositionMap,
	PositionObj,
	SignChecker,
	SurePosition,
	WorkerManagerAsync,
	WorkerRunnerAsync,
} from "..";

type MapObj<T, K extends Id = Id> = { [I in K]: T | undefined };
export class Tsc<I extends Id> extends SignChecker<I> {
	static idv = class extends Tsc<Id> {
		constructor() {
			super();
			this.ensureds.add(Loader.START).add(Loader.END);
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
		m: this.contextMaker,
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
export const se = [Loader.START, Loader.END] as const;
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
	const j = liv.map(([i, is = []]) => [i, new Set([...is, Loader.END])] as const);
	j.push([Loader.END, new Set()]);
	return j;
}
export function to(t: number) {
	return new Promise(res => setTimeout(res, t));
}
