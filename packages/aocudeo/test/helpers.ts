import {
	SignChecker,
	PositionMap,
	Id,
	SurePosition,
	PositionObj,
	Loader,
} from "..";

export class Tsc extends SignChecker<void> {
	static get = () => [
		this.ENSURED,
		this.REQUIRED,
	] as const;
	get = () => ({
		sm: this.statusMap,
	} as const);
}
export const [scE, scR] = Tsc.get();
export class Tpm extends PositionMap<void> {
	static get = () => [
		this.SPLITED,
		this.HOLDED,
	] as const;
	get = () => ({
		spm: this.surePositionMap,
		sm: this.splitedMap,
	} as const);
}
export const [pmS, pmH] = Tpm.get();
export function ti(i: Id[]) {
	return new SurePosition(new PositionObj(i));
}
export function gsm<T>(k: readonly Id[], s: T) {
	const sm: { [x: Id]: T; } = {};
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
