import test from 'tape';
import { Executor } from '../../lib/executor';
import { PositionMap } from '../../lib/position';
import type { Id } from '../../lib/types';
import { WorkerManager } from '../../lib/worker';
import { aeh, mm, mmo, nem, se } from '../helpers';

import { Organizer } from '../../lib/organizer';

function cer(init: (pm: PositionMap) => void, liv: [Id, Id[]?][]) {
	return (t: test.Test) => {
		const pm = new PositionMap();
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
			[Organizer.start, [Organizer.end]],
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
				Organizer.end,
			]],
			[Symbol.for('hh1'), [Symbol.for('hh0'), Organizer.end]],
			[Symbol.for('hh0'), [Organizer.end]],
		],
	));

	t.test('简单钩子', cer(
		pm => {
			pm.insert('hh0', 'hh1');
			pm.insert('hh1', {});
		},
		[
			[Organizer.start, ['pre:hh0', 'pre:hh1', Organizer.end]],
			['pre:hh1', ['main:hh1']],
			['main:hh1', ['post:hh1']],
			['post:hh1', ['pre:hh0', Organizer.end]],
			['pre:hh0', ['main:hh0']],
			['main:hh0', ['post:hh0']],
			['post:hh0', [Organizer.end]],
		],
	));

	t.test('双层钩子', cer(
		pm => {
			pm.insert('pre:hh', {});
		},
		[
			[Organizer.start, ['pre:pre:hh', Organizer.end]],
			['pre:pre:hh', ['main:pre:hh']],
			['main:pre:hh', ['post:pre:hh']],
			['post:pre:hh', ['main:hh']],
			['main:hh', ['post:hh']],
			['post:hh', [Organizer.end]],
		],
	));

	t.test('复杂钩子', cer(
		pm => {
			pm.insert('pre:pre:hh', {});
			pm.insert('post:hh', {});
		},
		[
			[Organizer.start, ['pre:pre:pre:hh', Organizer.end]],
			['pre:pre:pre:hh', ['main:pre:pre:hh']],
			['main:pre:pre:hh', ['post:pre:pre:hh']],
			['post:pre:pre:hh', ['main:pre:hh']],
			['main:pre:hh', ['post:pre:hh']],
			['post:pre:hh', ['main:hh']],
			['main:hh', ['pre:post:hh']],
			['pre:post:hh', ['main:post:hh']],
			['main:post:hh', ['post:post:hh']],
			['post:post:hh', [Organizer.end]],
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

test('得到执行器', t => {
	const pm = new PositionMap();
	const e = pm.getGraph().getExecutor(new WorkerManager<void, any>().getRunner());
	t.ok(e instanceof Executor, '安全得到执行器');

	t.end();
});
