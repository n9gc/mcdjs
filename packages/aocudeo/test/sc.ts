import test from 'tape';
import { Id } from '..';
import { Tsc, gsm, pse, se, car, ti } from './helpers';

function cer(i: Id[]) {
	let t: test.Test;
	function checkRequired(sc: Tsc) {
		t.deepEqual(
			car(sc.get().re),
			car(i),
			'集合：requireds 中包含初始化的内容'
		);
		t.deepEqual(
			car(sc.get().en),
			car(se),
			'集合：ensureds 中包含起点终点标记'
		);
		for (const j of i) {
			t.false(
				sc.isEnsured(j),
				`应用接口：不确认 ${j.toString()}`
			);
		}
		for (const j of i) {
			t.true(
				sc.isRequired(j),
				`应用接口：被引用 ${j.toString()}`
			);
		}
		if (i.length) { // 不为空
			t.true(
				sc.isSafe(),
				'安全检查：不空不为 false'
			);
			t.deepEqual(
				gsm(sc.isSafe() || [], 0),
				gsm(i, 0),
				'安全检查：返回信息无误'
			);
		} else {
			t.false(
				sc.isSafe(),
				'安全检查：空时为否'
			);
		}
	}
	function checkEnsured(sc: Tsc) {
		t.equal(
			sc.getSize('required'),
			0,
			'集合：requireds 中再无元素'
		);
		t.deepEqual(
			car(sc.get().en),
			car(pse(i)),
			'集合：ensureds 包含所有'
		);
		t.false(
			sc.isSafe(),
			'安全检查：确认后安全'
		);
	}
	return (tin: test.Test) => {
		t = tin;
		const sc = new Tsc();
		sc.requirePosition(ti(i));
		checkRequired(sc);
		sc.ensure(...i);
		checkEnsured(sc);
		t.end();
	}
}

test('空转检查', cer(
	[],
));

test('只带标识', cer(
	[Symbol('hh'), Symbol('nn')],
));

test('只带字符', cer(
	['hh', 'nn'],
));

test('只带数字', cer(
	[7, 8, 1, 2],
));

test('混合检查', cer(
	['hh', 'nn', 3, 2, Symbol('hh'), Symbol('nn')],
));

