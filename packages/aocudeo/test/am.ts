import test from "tape";
import { Organizer, WorkerContext, WorkerManagerAsync, WorkerManagerSync } from '..';
import { Twma, Twra, to, msf } from './helpers';
import Queue from "queue";

test('回调冒泡', t => {
	t.test('同级冒泡', t => {
		const wm = new WorkerManagerSync<void>();
		const mf = msf();
		wm.add('hh', mf(1));
		wm.add('hh', mf(2));
		wm.add('hh', mf(3));
		wm.getRunner().run('hh');
		t.deepEqual(
			mf()(),
			[1, 2, 3],
			'顺序正确'
		);
		t.end();
	});

	t.test('往上冒泡', t => {
		const wm = new WorkerManagerSync<void>();
		const mf = msf();
		wm.add('main:main:hh', mf(1));
		wm.add('main:hh', mf(2));
		wm.add('hh', mf(3));
		wm.getRunner().run('main:main:hh');
		t.deepEqual(
			mf()(),
			[1, 2, 3],
			'顺序正确'
		);
		t.end();
	});

	t.test('中央冒泡', t => {
		const wm = new WorkerManagerSync<void>();
		const mf = msf();
		wm.add('pre:hh', mf(1));
		wm.add('main:hh', mf(2));
		wm.add('post:hh', mf(4));
		wm.add('hh', mf(3));
		const wr = wm.getRunner();
		wr.run('pre:hh');
		wr.run('main:hh');
		wr.run('post:hh');
		t.deepEqual(
			mf()(),
			[1, 2, 3, 4],
			'顺序正确'
		);
		t.end();
	});

	t.end();
});

test('##同步函数', t => {
	t.test('普通回调', t => {
		t.plan(1);
		const wm = new WorkerManagerSync<void>();
		wm.add(Organizer.start, () => t.pass('函数运行'));
		const wr = wm.getRunner();
		wr.run(Organizer.start);
	});

	t.test('多个回调', t => {
		t.plan(2);
		const wm = new WorkerManagerSync<void>();
		wm.add(Organizer.start, () => t.pass('第一个函数'));
		wm.add(Organizer.start, () => t.pass('第二个函数'));
		const wr = wm.getRunner();
		wr.run(Organizer.start);
	});

	t.test('携带参数', t => {
		const wm = new WorkerManagerSync<5>();
		wm.add(Organizer.start, context => {
			t.equal(
				context.data,
				5,
				'包含上下文'
			);
			t.end();
		});
		const wr = wm.getRunner(5);
		wr.run(Organizer.start);
	});

	t.test('修改参数', t => {
		const wm = new WorkerManagerSync<number>();
		wm.add(Organizer.start, context => {
			t.equal(
				context.data,
				123,
				'符合初始值'
			);
			context.data = 321;
		});
		wm.add(Organizer.start, context => {
			t.equal(
				context.data,
				321,
				'成功修改值'
			);
		});
		wm.add(Organizer.start, () => t.end());
		const wr = wm.getRunner(123);
		wr.run(Organizer.start);
	});

	t.end();
});

test('##异步函数', t => {

	t.test('普通回调', t => {
		t.plan(1);
		const wm = new WorkerManagerAsync<void>();
		wm.add(Organizer.start, { run: async () => t.pass('函数运行') });
		const wr = wm.getRunner(void 0, 0);
		wr.run(Organizer.start);
	});

	t.test('携带参数', t => {
		const wm = new WorkerManagerAsync<5>();
		wm.add(Organizer.start, async context => {
			t.equal(
				context.data,
				5,
				'包含上下文'
			);
			t.end();
		});
		const wr = wm.getRunner(5, 0);
		wr.run(Organizer.start);
	});

	t.test('连续回调', t => {
		const wm = new WorkerManagerAsync<number>();
		wm.add(Organizer.start, async context => {
			t.equal(
				context.data,
				1,
				'第一次被执行'
			);
			context.data++;
		});
		wm.add(Organizer.start, async context => {
			t.equal(
				context.data,
				2,
				'第二次被执行'
			);
		});
		wm.add(Organizer.start, () => t.end());
		const wr = wm.getRunner(1, 0);
		wr.run(Organizer.start);
	});

	t.test('并行回调', t => {
		t.plan(6);
		const wm = new WorkerManagerAsync<number>();
		wm.add(Organizer.start, async context => {
			await to(5);
			t.equal(
				context.data,
				1,
				'并行执行中'
			);
		});
		wm.add(Organizer.end, async context => {
			context.data++;
			t.pass('先启动了');
			await to(10);
			t.pass('后结束了');
			context.data--;
		});
		const wr0 = wm.getRunner(0, 0);
		wr0.run(Organizer.end);
		wr0.run(Organizer.start);
		const wr1 = wm.getRunner(0, 0);
		wr1.run(Organizer.start);
		wr1.run(Organizer.end);
	});

	t.test('并行限制', t => {
		t.plan(6);
		const wm = new WorkerManagerAsync<number>();
		async function a(context: WorkerContext<number>) {
			context.data++;
			t.assert(
				context.data < 3,
				'并行未大于 2'
			);
			await to(5);
			t.assert(
				context.data < 3,
				'并行未大于 2'
			);
			context.data--;
		}
		wm.add(Organizer.start, a);
		wm.add(Organizer.end, a);
		wm.add(Organizer.unknown, a);
		const wr0 = wm.getRunner(0, 2);
		wr0.run(Organizer.end);
		wr0.run(Organizer.start);
		wr0.run(Organizer.unknown);
	});

	t.test('跳过空值', t => {
		const wm = new Twma<void>();
		const l0 = new Queue({ autostart: true, concurrency: 0 });
		const wr0 = new Twra(wm.get().wm, void 0, l0);
		wr0.run(Organizer.start);
		t.equal(
			l0.length,
			0,
			'没使用任何队列资源'
		);
		wm.add(Organizer.end, []);
		const l1 = new Queue({ autostart: true, concurrency: 0 });
		const wr1 = new Twra(wm.get().wm, void 0, l1);
		wr1.run(Organizer.end);
		t.equal(
			l1.length,
			0,
			'没使用任何队列资源'
		);
		t.end();
	});

	t.end();
});

