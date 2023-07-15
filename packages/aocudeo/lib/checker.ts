/**
 * 各种检查器
 * @module aocudeo/lib/checker
 * @version 1.1.0
 * @license GPL-2.0-or-later
 */
declare module './checker';

import { Id } from './types';
import { MapObj } from './types';
import { Organizer } from './organizer';

export class SignChecker<I extends Id> {
	protected ensureds = new Set<I>();
	protected requireds = new Set<I>();
	countEnsureds() {
		return this.ensureds.size;
	}
	getEnsureds() {
		return new Set(this.ensureds);
	}
	isEnsured(id: I) {
		return this.ensureds.has(id);
	}
	isRequired(id: I) {
		return this.requireds.has(id);
	}
	ensure(...ids: I[]) {
		ids.forEach(id => {
			this.ensureds.add(id);
			this.requireds.delete(id);
		});
	}
	require(...ids: I[]) {
		ids.forEach(id => this.ensureds.has(id) || this.requireds.add(id));
	}
	get result(): readonly Id[] | false {
		return this.requireds.size ? [...this.requireds] : false;
		// throwError(3, Error('出现了未注册的模块'), { list });
	}
}
export class CircleChecker {
	private readonly circle: Id[] = [];
	private readonly checkedChecker = new SignChecker<Id>();
	private out(id: Id) {
		this.circle.splice(0, this.circle.indexOf(id));
		return true;
	}
	private mark(id: Id) {
		this.checkedChecker.require(id);
		this.circle.push(id);
	}
	private unmark(id: Id) {
		this.checkedChecker.ensure(id);
		this.circle.pop();
	}
	private from(id: Id) {
		if (this.checkedChecker.isEnsured(id)) return false;
		if (this.checkedChecker.isRequired(id)) return this.out(id);
		this.mark(id);
		for (const p of this.edgeMap[id]!) if (this.from(p)) return true;
		this.unmark(id);
		return false;
	}
	readonly result: false | readonly Id[];
	constructor(
		private edgeMap: MapObj<readonly Id[]>,
	) {
		this.result = this.from(Organizer.start) && this.circle;
		// throwError(2, Error('出现环形引用'), { circle });
	}
}
