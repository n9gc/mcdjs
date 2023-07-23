/**
 * 各种检查器
 * @module aocudeo/lib/checker
 * @version 2.0.2
 * @license GPL-2.0-or-later
 */
declare module './checker';

import { Organizer } from './organizer';
import type { Id, MapObj } from './types';
import { throwError } from './util';

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
	tryThrow() {
		if (this.requireds.size) throwError(3, Error('出现了未注册的模块'), { list: this.requireds });
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
	throw() {
		throwError(2, Error('出现环形引用'), { circle: this.circle });
	}
	constructor(
		private edgeMap: MapObj<readonly Id[]>,
	) {
		if (!this.from(Organizer.start)) this.throw = () => { };
	}
}
