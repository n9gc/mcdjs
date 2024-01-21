import test from 'tape';
import type { Id } from '../../lib/types';
import { pse, se } from '../helpers';
import { aeh } from '../util/helpers';
import { Tsc } from './helpers';

function cer(i: Id[]) {
	function req(sc: Tsc<Id>) {
		sc.require(...i);
	}
	function ens(sc: Tsc<Id>) {
		sc.ensure(...i);
	}
	return (t: test.Test) => {
		t.test('集合', t => {
			const sc = new Tsc.idv();
			req(sc);

			t.deepEqual(
				sc.get().re,
				new Set(i),
				'requireds 中包含初始化的内容'
			);
			t.deepEqual(
				sc.getEnsureds(),
				new Set(se),
				'ensureds 中包含起点终点标记'
			);

			ens(sc);

			t.deepEqual(
				sc.get().re,
				new Set(),
				'requireds 中再无元素'
			);
			t.equal(
				sc.countEnsureds(),
				2 + i.length,
				'requireds 数量正确'
			);
			t.deepEqual(
				sc.getEnsureds(),
				new Set(pse(i)),
				'ensureds 包含所有'
			);

			t.end();
		});

		if (i.length) t.test('应用接口', t => {
			const sc = new Tsc.idv();
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
			const sc = new Tsc.idv();
			req(sc);

			if (i.length) { // 不为空
				t.throws(
					aeh(() => sc.tryThrow()),
					{ type: 3, list: new Set(i) },
					'返回信息无误'
				);
			} else {
				t.doesNotThrow(
					() => sc.tryThrow(),
					'空时为否'
				);
			}

			ens(sc);

			t.doesNotThrow(
				() => sc.tryThrow(),
				'确认后安全'
			);

			t.end();
		});

		t.end();
	};
}

test('##标识符检查器', t => {
	t.test('#空转检查', cer(
		[],
	));

	t.test('#只带标识', cer(
		[Symbol('hh'), Symbol('nn')],
	));

	t.test('#只带字符', cer(
		['hh', 'nn'],
	));

	t.test('#只带数字', cer(
		[7, 8, 1, 2],
	));

	t.test('#混合检查', cer(
		['hh', 'nn', 3, 2, Symbol('hh'), Symbol('nn')],
	));

	t.end();
});

