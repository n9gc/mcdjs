/**
 * 胡乱加载链表类定义模块
 * @module mcdjs/lib/alload/chainlist
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
declare module './chainlist';

import { EType, throwErr } from '@mcdjs/base/dist/errlib';
import { BInT, Shifted, Vcb } from '@mcdjs/base/dist/types';

type ArgAll = [rev: boolean, pos: string, name: string, action: Vcb];
type Arg = Shifted<ArgAll>;

export default class ChainList {
	private list = new Map([['pole', 'pole']]);
	private listRev = new Map([['pole', 'pole']]);
	private actions = new Map<string, Vcb>;
	private waiting = new Map<string, ArgAll[]>;
	protected insertAllType(...args: ArgAll[]): this {
		if (!args.length) return this;
		const [[rev, pos, name, action], ...argsNext] = args;
		this.actions.set(name, action);
		const [l0, l1] = rev ? [this.listRev, this.list] : [this.list, this.listRev];
		const n = l0.get(pos);
		if (!n) {
			let argList: ArgAll[];
			this.waiting.has(pos)
				? argList = this.waiting.get(pos)!
				: this.waiting.set(pos, argList = []);
			argList.push(args[0]);
			return this;
		}
		l0.set(pos, name);
		l0.set(name, n);
		l1.set(n, name);
		l1.set(name, pos);
		return this.insertAllType(...argsNext, ...(this.waiting.get(name) ?? []));
	}
	insertAfter(...args: Arg) {
		return this.insertAllType([false, ...args]);
	}
	insertBefore(...args: Arg) {
		return this.insertAllType([true, ...args]);
	}
	protected act() {
		let now = this.list.get('pole');
		while (now && now !== 'pole') {
			this.actions.get(now)?.();
			this.actions.delete(now);
			now = this.list.get(now);
		}
	}
	private getProp = <T extends {}, K extends BInT<keyof T, string>>(n: T, key: K): T[K] => {
		this.act();
		this.getProp = (n, key) => key in n
			? n[key]
			: (
				this.act(),
				key in n
					? n[key]
					: throwErr(EType.ErrUseBeforeDefine, Error(), key)
			);
		return this.getProp(n, key);
	};
	setGetter<T extends {}>(mod: T, ori: T, keys: BInT<keyof T, string>[]) {
		const keyMap: PropertyDescriptorMap = {};
		keys.forEach(key => {
			keyMap[key] = {
				get: () => this.getProp(ori, key),
				set: () => throwErr(EType.ErrCannotBeSeted, Error(), key),
			};
		});
		Object.defineProperties(mod, keyMap);
		return this;
	}
}
