import test from 'tape';
import { Diagram } from '../../lib/diagram';
import { PositionMap, SurePosition } from '../../lib/position';
import type { Id } from '../../lib/types';
import { aeh } from '../util/helpers';
import { Tpm } from './helpers';

import { Organizer } from '../../lib/organizer';

function cer(init: (pm: PositionMap) => void, ss: string[], di: Id[] = []) {
	return (t: test.Test) => {
		const pm = new Tpm();
		init(pm);

		t.deepEqual(
			pm.get().sc.get().en,
			new Set(ss),
			'拆分标识无缺失'
		);

		const enl = [
			Organizer.start, Organizer.end,
			ss,
			...ss.map(n => Organizer.affixs.map(a => a + n)),
		].flat();
		t.deepEqual(
			pm.get().ic.get().en,
			new Set(enl),
			'保证节点无缺失'
		);

		const h = new Set<Id>([Organizer.end]);
		ss.forEach(n => h.add('pre:' + n).add('main:' + n).add('post:' + n).delete(n));
		const spmo = new Map([...h].map(i => [i, new SurePosition({})]));
		t.deepEqual(
			pm.get().spm.keys(),
			spmo.keys(),
			'位置无父节点'
		);

		[...di, Organizer.end].forEach(i => spmo.set(i, pm.get().spm.get(i)!));
		t.deepLooseEqual(
			pm.get().spm,
			spmo,
			'位置数组拆分正确'
		);

		t.end();
	};
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
			pm.insert('hh4', 'pre:pre:hh1');
		},
		['hh1', 'pre:hh1', 'hh4'],
		['pre:hh4', 'post:hh4'],
	));

	t.test('占取拆分', cer(
		pm => {
			pm.insert('hh4', 'pre:hh1');
			pm.insert('hh4', 'pre:pre:hh1');
			pm.insert('pre:hh1', {});
		},
		['hh1', 'pre:hh1', 'hh4'],
		['pre:hh4', 'post:hh4'],
	));

	t.end();
});

function der(init: (pm: PositionMap) => void, ce: boolean) {
	return (t: test.Test) => {
		const pm = new Tpm();
		pm.insert('hh1', 'hh2');
		pm.getGraph();
		init(pm);
		if (ce) {
			t.equal(
				pm.get().gc,
				null,
				'版本需变更'
			);
		} else {
			t.notEqual(
				pm.get().gc,
				null,
				'版本需不变'
			);
		}
		t.end();
	};
};

test('##版本控制', t => {
	t.test('插入未有', der(
		pm => {
			pm.insert('pre:hh1', {});
		},
		true,
	));

	t.test('改变关系', der(
		pm => {
			pm.insert('hh1', 'hh3');
		},
		true,
	));

	t.test('版本不变', der(
		pm => {
			pm.insert('hh1', 'hh2');
		},
		false,
	));

	t.end();
});

test('##错误检查', t => {
	t.test('比前还前', t => {
		const pm = new Tpm();
		pm.insert('a', { before: Organizer.start });
		t.throws(
			aeh(() => pm.tryThrow()),
			{ type: 0, id: 'a' },
			'成功报错'
		);
		t.end();
	});

	t.test('比后还后', t => {
		const pm = new Tpm();
		pm.insert('b', Organizer.end);
		t.throws(
			aeh(() => pm.tryThrow()),
			{ type: 1, id: 'b' },
			'成功报错'
		);
		t.end();
	});

	t.test('图里有环', t => {
		const pm = new Tpm();
		pm.insert(Symbol.for('a'), Symbol.for('b'));
		pm.insert(Symbol.for('b'), Symbol.for('a'));
		t.throws(
			aeh(() => pm.tryThrow()),
			{ type: 2, circle: new Set([Symbol.for('b'), Symbol.for('a')]) },
			'成功报错'
		);
		t.end();
	});

	t.test('缺少模块', t => {
		const pm = new Tpm();
		pm.insert(Symbol.for('a'), Symbol.for('b'));
		t.throws(
			aeh(() => pm.tryThrow()),
			{ type: 3, list: new Set([Symbol.for('b')]) },
			'成功报错'
		);
		t.end();
	});

	t.end();
});

test('获取图例', t => {
	const pm = new Tpm();

	const d = pm.getDiagram();
	t.ok(d instanceof Diagram, '安全得到图例');
	t.equal(pm.getDiagram(), d, '缓存图例');

	t.end();
});