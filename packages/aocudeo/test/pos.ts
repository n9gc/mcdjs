import test from 'tape';
import { PositionMap, Loader, Id, SurePosition } from '..';
import { Tpm, gsm, car, cma, mmo } from './helpers';

function cer(init: (pm: PositionMap<void>) => void, ss: string[], di: Id[] = []) {
	return (t: test.Test) => {
		const pm = new Tpm();
		init(pm);

		t.deepEqual(
			car(pm.get().sc.get().en),
			car(ss),
			'拆分标识无缺失'
		);

		const enl = [
			Loader.START, Loader.END,
			ss,
			...ss.map(n => Loader.getAffixs().map(a => a + n)),
		].flat();
		t.deepEqual(
			car(pm.get().ic.get().en),
			car(enl),
			'保证节点无缺失'
		);
		
		const h = new Set<string>();
		ss.forEach(n => h.add('pre:' + n).add('main:' + n).add('post:' + n).delete(n));
		const spmo = gsm(h, { after: {}, before: {} });
		t.deepEqual(
			car(pm.get().spm.keys()),
			car(h),
			'位置无父节点'
		);

		const oj: { [x: Id]: { after: { [x: Id]: number }, before: { [x: Id]: number } } } = Object.create(null);
		pm.get().spm.forEach((v, i) => oj[i] = { after: car(v.after), before: car(v.before) });
		[...di, Loader.END].forEach(i => spmo[i] = oj[i]);
		t.deepLooseEqual(
			oj,
			spmo,
			'位置数组拆分正确'
		);

		t.end();
	}
};

test('##基础功能', t => {
	t.test('单独一个', cer(
		pm => {
			pm.insert('hh1', {});
		},
		['hh1'],
	));

	t.test('简单两个', cer(
		pm => {
			pm.insert('hh1', {});
			pm.insert('hh2', 'hh1');
		},
		['hh1', 'hh2'],
		['pre:hh2'],
	));

	t.test('补充添加', cer(
		pm => {
			pm.insert('hh1', {});
			pm.insert('hh2', 'hh1');
			pm.insert('hh2', { before: 'hh1' });
		},
		['hh1', 'hh2'],
		['pre:hh2', 'post:hh2'],
	));

	t.test('插后拆分', cer(
		pm => {
			pm.insert('hh1', {});
			pm.insert('hh2', 'hh1');
			pm.insert('pre:hh2', {});
		},
		['hh1', 'hh2', 'pre:hh2'],
		['pre:pre:hh2'],
	));

	t.test('插前拆分', cer(
		pm => {
			pm.insert('hh1', {});
			pm.insert('pre:hh2', {});
			pm.insert('hh2', 'hh1');
		},
		['hh1', 'hh2', 'pre:hh2'],
		['pre:pre:hh2'],
	));

	t.test('简单钩子', cer(
		pm => {
			pm.insert('hh1', {});
			pm.insert('hh2', { postOf: 'hh1' });
			pm.insert('hh3', { preOf: 'hh1' });
		},
		['hh1', 'hh2', 'hh3'],
		['pre:hh3', 'post:hh3', 'pre:hh2', 'post:hh2'],
	));

	t.test('儿子生爸', cer(
		pm => {
			pm.insert('pre:pre:hh2', {});
		},
		['hh2', 'pre:hh2', 'pre:pre:hh2'],
	));

	t.test('索取拆分', cer(
		pm => {
			pm.insert('hh1', {});
			pm.insert('hh4', 'pre:pre:hh1')
		},
		['hh1', 'pre:hh1', 'hh4'],
		['pre:hh4', 'post:hh4'],
	));

	t.test('占取拆分', cer(
		pm => {
			pm.insert('hh4', 'pre:hh1')
			pm.insert('hh4', 'pre:pre:hh1')
			pm.insert('pre:hh1', {});
		},
		['hh1', 'pre:hh1', 'hh4'],
		['pre:hh4', 'post:hh4'],
	));

	t.end();
});

function der(init: (pm: PositionMap<void>) => void, ce: boolean) {
	return (t: test.Test) => {
		const pm = new Tpm();
		pm.insert('hh1', 'hh2');
		const eb = pm.get().e;
		init(pm);
		if (ce) {
			t.notEqual(
				pm.get().e,
				eb,
				'版本需变更'
			);
		} else {
			t.equal(
				pm.get().e,
				eb,
				'版本需不变'
			);
		}
		t.end();
	}
};

test('##版本控制', t => {
	test('插入未有', der(
		pm => {
			pm.insert('pre:hh1', {});
		},
		true,
	));

	test('改变关系', der(
		pm => {
			pm.insert('hh1', 'hh3');
		},
		true,
	));

	test('版本不变', der(
		pm => {
			pm.insert('hh1', 'hh2');
		},
		false,
	));

	t.end();
});

