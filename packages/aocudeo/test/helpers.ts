import {
	SignChecker,
	PositionMap,
	Id,
	SurePosition,
	PositionObj,
	Loader,
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
export function ti(i: Id[]) {
	return new SurePosition(new PositionObj(i));
}
export function gsm<T>(k: readonly Id[], s: T) {
	const sm: { [x: Id]: T; } = Object.create(null);
	k.forEach(id => sm[id] = s);
	return sm;
}
export const se = [Loader.START, Loader.END] as const;
export function pse(i: Id[]) {
	return [...se, ...i];
}
export function m<A extends {}, B extends {}>(a: A, b: B) {
	return {...a, ...b};
}
export function car(a: Set<Id> | readonly Id[]) {
	if (a instanceof Set) a = [...a];
	return gsm(a, 0);
}
