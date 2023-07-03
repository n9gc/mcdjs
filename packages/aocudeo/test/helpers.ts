import {
	SignChecker,
	PositionMap,
	Id,
	SurePosition,
	PositionObj,
	Loader,
	Position,
} from "..";

export class Tsc extends SignChecker {
	constructor() {
		super(true);
	}
	get = () => ({
		en: this.ensureds,
		re: this.requireds,
	});
}
export class Tpm extends PositionMap<void> {
	static get = () => [
		this.SPLITED,
		this.HOLDED,
	] as const;
	get = () => ({
		spm: this.surePositionMap,
		sc: this.splitedChecker,
		ic: this.insertedChecker,
		e: this.edition,
	});
	override insertedChecker = new Tsc();
	protected override splitedChecker = new Tsc();
}
export const [pmS, pmH] = Tpm.get();
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
	return {...a, ...b};
}
export function k(o: {}) {
	return Reflect.ownKeys(o);
}
export function car(a: Iterable<Id>) {
	return gsm(a, 0);
}
