import test from 'tape';
import {
	Id,
	Organizer,
	PositionMap,
	WorkerManagerAsync,
	WorkerManagerSync
} from '../..';
import { msf, ra } from '../helpers';

function cge(a: boolean) {
	function cer(sa: readonly Id[], init?: (pm: PositionMap<void>) => void) {
		return (t: test.Test) => {
			t.plan(1);
			const pm = new PositionMap<void>();
			init?.(pm);
			const wr = new (a ? WorkerManagerAsync : WorkerManagerSync)<void>();
			const mf = msf();
			ra(sa).forEach(i => wr.add(i, a ? async () => mf(i)() : mf(i)));
			wr.add(Organizer.end, () => {
				t.deepEqual(
					mf()(),
					sa,
					'顺序正确'
				);
			});
			pm.getGraph().getExecutor(wr.getRunner(void 0, 0))[a ? 'executeAsync' : 'executeSync']();
		}
	}

	return (t: test.Test) => {
		t.test('空转检查', cer(
			[
				Organizer.start,
				Organizer.end,
			],
		));

		t.test('单独标识', cer(
			[
				Organizer.start,
				Symbol.for('hh'),
				Organizer.end,
			],
			pm => {
				pm.insert(Symbol.for('hh'), {});
			},
		));

		t.test('简单顺序', cer(
			[
				Organizer.start,
				Symbol.for('hh0'),
				Symbol.for('hh1'),
				Organizer.end,
			],
			pm => {
				pm.insert(Symbol.for('hh0'), {});
				pm.insert(Symbol.for('hh1'), Symbol.for('hh0'));
			},
		));

		t.test('简单拆分', cer(
			[
				Organizer.start,
				'pre:hh',
				'main:hh',
				'post:hh',
				Organizer.end,
			],
			pm => {
				pm.insert('hh', {});
			},
		));

		t.end();
	}
}

test('##同步执行器', cge(false));

test('##异步执行器', cge(true));

