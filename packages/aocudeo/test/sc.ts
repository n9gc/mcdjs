import test from 'tape';
import { Id } from '..';
import { Tsc, gsm, pse, se, car, ti } from './helpers';

function cer(i: Id[]) {
	function req(sc: Tsc) {
		sc.requirePosition(ti(i));
	}
	function ens(sc: Tsc) {
		sc.ensure(...i);
	}
	return (t: test.Test) => {
		t.test('集合', t => {
			const sc = new Tsc();
			req(sc);

			t.deepEqual(
				car(sc.get().re),
				car(i),
				'requireds 中包含初始化的内容'
			);
			t.deepEqual(
				car(sc.get().en),
				car(se),
				'ensureds 中包含起点终点标记'
			);

			ens(sc);

			t.equal(
				sc.get().re.size,
				0,
				'requireds 中再无元素'
			);
			t.equal(
				sc.countEnsureds(),
				2 + i.length,
				'requireds 数量正确'
			);
			t.deepEqual(
				car(sc.get().en),
				car(pse(i)),
				'ensureds 包含所有'
			);

			t.end();
		});

		if (i.length) t.test('应用接口', t => {
			const sc = new Tsc();
			req(sc);

			for (const j of i) {
				t.false(
					sc.isEnsured(j),
					`不确认 ${j.toString()}`
				);
			}
			for (const j of i) {
				t.true(
					sc.isRequired(j),
					`被引用 ${j.toString()}`
				);
			}

			t.end();
		});

		t.test('安全检查', t => {
			const sc = new Tsc();
			req(sc);

			if (i.length) { // 不为空
				t.true(
					sc.isSafe(),
					'不空不为 false'
				);
				t.deepEqual(
					gsm(sc.isSafe() || [], 0),
					gsm(i, 0),
					'返回信息无误'
				);
			} else {
				t.false(
					sc.isSafe(),
					'空时为否'
				);
			}

			ens(sc);

			t.false(
				sc.isSafe(),
				'确认后安全'
			);

			t.end();
		});

		t.end();
	}
}

test('##空转检查', cer(
	[],
));

test('##只带标识', cer(
	[Symbol('hh'), Symbol('nn')],
));

test('##只带字符', cer(
	['hh', 'nn'],
));

test('##只带数字', cer(
	[7, 8, 1, 2],
));

test('##混合检查', cer(
	['hh', 'nn', 3, 2, Symbol('hh'), Symbol('nn')],
));

