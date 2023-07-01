import test, { Macro, ExecutionContext } from 'ava';
import { PositionMap, SignChecker, Loader, Id } from '../';
import expect from 'expect';

class Tsc extends SignChecker<void> {
	static get = () => [
		this.ENSURED,
		this.REQUIRED,
	] as const;
	get = () => ({
		sm: this.statusMap,
	} as const);
}
class Tpm extends PositionMap<void> {
	static get = () => [
		this.SPLITED,
		this.HOLDED,
	] as const;
	get = () => ({
		spm: this.surePositionMap,
		sm: this.splitedMap,
	} as const);
}
function gsm<T>(k: readonly Id[], s: T) {
	const sm: { [x: Id]: T; } = {};
	k.forEach(id => sm[id] = s);
	return sm;
}
const [scE, scR] = Tsc.get();
const [pmS, pmH] = Tpm.get();
const cer: Macro<[
	init: (pm: PositionMap<void>) => void,
	deeperlySplited: string[],
	withPosInfo?: Id[]
], unknown> = {
	exec(t, init, ss, di = []) {
		const sc = new Tsc();
		const pm = new Tpm(sc);
		init(pm);
		expect(pm.get().sm).toEqual(gsm(ss, pmS));
		expect(sc.get()).toEqual({ sm: gsm([Loader.START, Loader.END, ss, ...ss.map(n => Loader.getAffixs().map(a => a + n))].flat(), scE) });
		const h = new Set<string>();
		ss.forEach(n => h.add('pre:' + n).add('main:' + n).add('post:' + n).delete(n));
		const spmo = gsm([...h], {} as any);
		[...di, Loader.END].forEach(i => spmo[i] = pm.get().spm[i]);
		expect(pm.get().spm).toEqual(spmo);
		t.pass();
	}
};

test(
	'单独一个',
	cer,
	pm => {
		pm.insert('hh1', {});
	},
	['hh1'],
);

test(
	'简单两个',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh2', 'hh1');
	},
	['hh1', 'hh2'],
	['pre:hh2'],
);

test(
	'补充添加',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh2', 'hh1');
		pm.insert('hh2', { before: 'hh1' });
	},
	['hh1', 'hh2'],
	['pre:hh2', 'post:hh2'],
);

test(
	'插后拆分',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh2', 'hh1');
		pm.insert('pre:hh2', {});
	},
	['hh1', 'hh2', 'pre:hh2'],
	['pre:pre:hh2'],
);

test(
	'插前拆分',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('pre:hh2', {});
		pm.insert('hh2', 'hh1');
	},
	['hh1', 'hh2', 'pre:hh2'],
	['pre:pre:hh2'],
);

test(
	'简单钩子',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh3', { preOf: 'hh1' });
	},
	['hh1', 'hh3'],
	['pre:hh3', 'post:hh3'],
);

test(
	'儿子生爸',
	cer,
	pm => {
		pm.insert('pre:pre:hh2', {});
	},
	['hh2', 'pre:hh2', 'pre:pre:hh2'],
);

test(
	'索取拆分',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh4', 'pre:pre:hh1')
	},
	['hh1', 'pre:hh1', 'hh4'],
	['pre:hh4', 'post:hh4'],
);

test(
	'占取拆分',
	cer,
	pm => {
		pm.insert('hh4', 'pre:pre:hh1')
		pm.insert('hh1', {});
	},
	['hh1', 'pre:hh1', 'hh4'],
	['pre:hh4', 'post:hh4'],
);
