import test from 'tape';
import { Diagram } from '../../lib/diagram';
import { Organizer, OrganizerAsync, OrganizerSync } from '../../lib/organizer';
import { Id } from '../../lib/types';
import { msf } from '../helpers';
import { aeh } from '../util/helpers';

test('##组织器', t => {
	t.test('空转测试', t => {
		t.plan(2);
		const o = new OrganizerSync<void>();
		o.addWorkers({
			[Organizer.start]: () => t.pass('开始'),
			[Organizer.end]: () => t.pass('结束'),
		});
		o.execute();
	});

	t.test('同步复用', t => {
		t.plan(1);
		const o = new OrganizerSync<void>({ reusable: false });
		o.addWorker(Organizer.start, () => t.pass('运行一次'));
		o.execute();
		o.execute();
		o.execute();
	});

	t.test('异步复用', t => {
		t.plan(1);
		const o = new OrganizerAsync<void>({ reusable: false });
		o.addWorker(Organizer.start, async () => t.pass('运行一次'));
		o.execute();
		o.execute();
		o.execute();
	});

	t.test('错误检查', t => {
		const o = new OrganizerSync<void>();
		o.addPosition(Symbol.for('a'), Symbol.for('b'));
		t.throws(
			aeh(() => o.execute()),
			{ type: 3, list: new Set([Symbol.for('b')]) },
			'随便一错'
		);
		t.end();
	});

	t.test('自动注册', t => {
		t.plan(2);
		const o = new OrganizerSync<void>();
		o.addWorker('hh0', () => t.pass('自动注册'));
		o.addWorker('hh1', () => t.pass('强制注册'), false);
		o.addWorker('hh2', () => t.fail('不准注册！'), true);
		o.execute();
	});

	t.test('附赠回调', t => {
		t.plan(1);
		const o = new OrganizerSync<void>();
		o.addPosition('hh', {}, () => t.pass('附赠的回调'));
		o.execute();
	});

	t.test('连续位置', t => {
		const mf = msf();
		const o = new OrganizerSync<void>();
		o.addPositions(['hh0', 'hh1', 'hh2']);
		o.addWorkers({
			hh0: mf(0),
			hh1: mf(1),
			hh2: mf(2),
			[Organizer.end]() {
				t.deepEqual(
					mf()(),
					[0, 1, 2],
					'顺序正确'
				);
				t.end();
			}
		});
		o.execute();
	});

	t.test('初始创建', t => {
		t.plan(3);
		const o = new OrganizerAsync<string | void>({
			workers: {
				hh0: void 0,
				hh1: { run: () => t.pass('执行： hh1') },
				hh2(context) {
					t.pass('执行： hh2');
					context.data = 'hh';
				},
			},
			positions: {
				hh3: 'hh2',
			},
		});
		o.addWorker('hh0', () => t.fail('hh0 不能被插入'), true);
		o.addWorker('hh3', context => {
			t.equal(
				context.data,
				'hh',
				'顺序正确，执行： hh3'
			);
		});
		o.execute();
	});

	t.test('p-graph 示例', t => {
		const o = new OrganizerAsync<void>();
		const mf = msf();
		const order = [
			['putOnShoes', 'tieShoes'],
			['putOnShirt', 'putOnJacket'],
			['putOnShorts', 'putOnJacket'],
			['putOnShorts', 'putOnShoes'],
		];
		o.addWorker(Organizer.end, () => {
			order.forEach(a => {
				t.deepEqual(
					mf()().filter(n => (<Id[]>a).includes(n)),
					a,
					`顺序正确：${a}`
				);
			});
			t.end();
		});
		o.addWorkers(new Map([
			'putOnShirt',
			'putOnShorts',
			'putOnJacket',
			'putOnShoes',
			'tieShoes',
		].map(n => [n, { async run() { mf(n)(); } }])));
		o.addPositions(order);
		o.execute();
	});

	t.test('简单钩子', t => {
		const mf = msf();
		const o = new OrganizerSync<void>();
		o.addPositions({
			hh0: {},
			hh1: { preOf: 'hh0' },
			hh2: { before: 'hh0' },
			hh3: { postOf: 'hh0' },
			hh4: { after: 'hh0' },
		});
		o.addWorkers({
			hh2: mf(0),
			'pre:hh0': mf(1),
			hh1: mf(2),
			hh0: mf(3),
			hh3: mf(4),
			'post:hh0': mf(5),
			hh4: mf(6),
			[Organizer.end]() {
				t.deepEqual(
					mf()(),
					[0, 1, 2, 3, 4, 5, 6],
					'顺序正确'
				);
				t.end();
			}
		});
		o.execute();
	});

	t.end();
});

test('获取图例', t => {
	const o = new OrganizerSync();

	const d = o.getDiagram();
	t.ok(d instanceof Diagram, '安全得到图例');
	t.equal(o.getDiagram(), d, '缓存图例');

	t.end();
});