import test from 'tape';
import { Id, Organizer, PositionMap } from '../..';
import { aeh, mm, mmo, nem, se } from '../helpers';

function cer(init: (pm: PositionMap<void>) => void, liv: [Id, Id[]?][]) {
	return (t: test.Test) => {
		const pm = new PositionMap<void>();
		init(pm);
		const g = pm.getGraph();
		const k = new Map<Id, number>();
		const j = nem(liv);
		j.forEach(([_, i]) => i.forEach(s => k.set(s, (k.get(s) ?? 0) + 1)));
		k.set(Organizer.start, 1);
		t.deepEqual(
			g.indegreeMap,
			mm(true, k.entries()),
			'入度正确'
		);
		t.deepEqual(
			mmo(g.edgeMap, v => new Set(v)),
			mm(true, j),
			'边正确'
		);
		t.end();
	};
}

test('##基本功能', t => {
	t.test('空转排序', cer(
		() => { },
		[
			[Organizer.start],
		],
	));

	t.test('简单符号', cer(
		pm => {
			pm.insert(Symbol.for('hh0'), Symbol.for('hh1'));
			pm.insert(Symbol.for('hh1'), {});
		},
		[
			[Organizer.start, [
				Symbol.for('hh0'), Symbol.for('hh1'),
			]],
			[Symbol.for('hh1'), [Symbol.for('hh0')]],
			[Symbol.for('hh0')],
		],
	));

	t.test('简单钩子', cer(
		pm => {
			pm.insert('hh0', 'hh1');
			pm.insert('hh1', {});
		},
		[
			[Organizer.start, [
				'pre:hh0', 'main:hh0', 'post:hh0',
				'pre:hh1', 'main:hh1', 'post:hh1',
			]],
			['pre:hh1', ['main:hh1']],
			['main:hh1', ['post:hh1']],
			['post:hh1', ['pre:hh0']],
			['pre:hh0', ['main:hh0']],
			['main:hh0', ['post:hh0']],
			['post:hh0'],
		],
	));

	t.test('双层钩子', cer(
		pm => {
			pm.insert('pre:hh', {});
		},
		[
			[Organizer.start, [
				'pre:pre:hh', 'main:pre:hh', 'post:pre:hh',
				'main:hh', 'post:hh',
			]],
			['pre:pre:hh', ['main:pre:hh']],
			['main:pre:hh', ['post:pre:hh']],
			['post:pre:hh', ['main:hh']],
			['main:hh', ['post:hh']],
			['post:hh'],
		],
	));

	t.test('复杂钩子', cer(
		pm => {
			pm.insert('pre:pre:hh', {});
			pm.insert('post:hh', {});
		},
		[
			[Organizer.start, [
				'pre:pre:pre:hh', 'main:pre:pre:hh', 'post:pre:pre:hh',
				'main:pre:hh', 'post:pre:hh',
				'main:hh',
				'pre:post:hh', 'main:post:hh', 'post:post:hh',
			]],
			['pre:pre:pre:hh', ['main:pre:pre:hh']],
			['main:pre:pre:hh', ['post:pre:pre:hh']],
			['post:pre:pre:hh', ['main:pre:hh']],
			['main:pre:hh', ['post:pre:hh']],
			['post:pre:hh', ['main:hh']],
			['main:hh', ['pre:post:hh']],
			['pre:post:hh', ['main:post:hh']],
			['main:post:hh', ['post:post:hh']],
			['post:post:hh'],
		],
	));

	t.end();
});

test('##应用接口', t => {
	t.test('安全不变', t => {
		const g = new PositionMap().getGraph();
		t.doesNotThrow(
			() => g.tryThrow(),
			'安全'
		);
		t.doesNotThrow(
			() => g.tryThrow(),
			'安全不变'
		);
		t.end();
	});

	t.test('危险不变', t => {
		const pm = new PositionMap();
		pm.insert(Organizer.start, Organizer.end);
		const g = pm.getGraph();
		const da = { type: 2, circle: new Set(se) };
		t.throws(
			aeh(() => g.tryThrow()),
			da,
			'危险'
		);
		t.throws(
			aeh(() => g.tryThrow()),
			da,
			'危险不变'
		);
		t.end();
	});

	t.end();
});

