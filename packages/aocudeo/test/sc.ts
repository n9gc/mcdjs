import test, { Macro } from 'ava';
import expect from 'expect';
import { Id } from '..';
import { Tsc, gsm, pse, se, car } from './helpers';

const cer: Macro<[Id[]], unknown> = {
	exec(t, i) {
		// 初始化
		const sc = new Tsc(true);

		// 都引用一下
		sc.require(...i);

		// requireds 中包含初始化的内容
		expect(car(sc.get().re)).toEqual(car(i));

		// ensureds 中包含起点终点标记
		expect(car(sc.get().en)).toEqual(car(se));

		// is 函数正常
		for (const j of i) expect([j, sc.isEnsured(j)]).toEqual([j, false]);
		for (const j of i) expect([j, sc.isRequired(j)]).toEqual([j, true]);

		// 能够安全检查
		if (i.length) {
			expect(sc.isSafe()).toBeTruthy();
			expect(gsm(sc.isSafe() || [], 0)).toEqual(gsm(i, 0));
		} else expect(sc.isSafe()).toBe(false);

		// 都保证一下
		sc.ensure(...i);

		// requireds 中再无元素
		expect(sc.getSize('required')).toBe(0);

		// ensureds 包含所有
		expect(car(sc.get().en)).toEqual(car(pse(i)));

		// 能够安全检查
		expect(sc.isSafe()).toBe(false);

		// 结束
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
