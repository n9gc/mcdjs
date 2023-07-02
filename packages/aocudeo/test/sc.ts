import test, { Macro } from 'ava';
import expect from 'expect';
import { Id } from '..';
import { ti, Tsc, gsm, scE, scR, pse, m, se } from './helpers';

const cer: Macro<[Id[]], unknown> = {
	exec(t, i) {
		const sc0 = new Tsc();
		sc0.ensure(...i);
		expect(sc0.get().sm).toEqual(gsm(pse(i), scE));
		for (const j of i) expect([j, sc0.isEnsured(j)]).toEqual([j, true]);
		const sc1 = new Tsc();
		sc1.require(ti(i));
		expect(sc1.get().sm).toEqual(m(gsm(i, scR), gsm(se, scE)));
		for (const j of i) expect([j, sc1.isEnsured(j)]).toEqual([j, false]);
		if (i.length) {
			expect(sc1.isSafe()).toBeTruthy();
			expect(gsm(sc1.isSafe() || [], 0)).toEqual(gsm(i, 0));
		}
		sc1.ensure(...i);
		expect(sc1.get().sm).toEqual(gsm(pse(i), scE));
		expect(sc1.isSafe()).toBe(false);
		t.pass();
	}
}

test(
	'空转检查',
	cer,
	[],
);

test(
	'只带标识',
	cer,
	[Symbol('hh'), Symbol('nn')],
);

test(
	'只带字符',
	cer,
	['hh', 'nn'],
);

test(
	'只带数字',
	cer,
	[7, 8, 1, 2],
);

test(
	'混合检查',
	cer,
	['hh', 'nn', 3, 2, Symbol('hh'), Symbol('nn')],
);
