import test from "tape";
import { Loader, WorkerContext, WorkerManagerAsync, WorkerManagerSync } from '..';
import { Twma, Twra, to } from './helpers';
import Queue from "queue";

test('##同步函数', t => {
	t.test('普通回调', t => {
		t.plan(1);
		const wm = new WorkerManagerSync<void>();
		wm.add(Loader.START, () => t.pass('函数运行'));
		const wr = wm.getRunner();
		wr.run(Loader.START);
	});

	t.test('多个回调', t => {
		t.plan(2);
		const wm = new WorkerManagerSync<void>();
		wm.add(Loader.START, () => t.pass('第一个函数'));
		wm.add(Loader.START, () => t.pass('第二个函数'));
		const wr = wm.getRunner();
		wr.run(Loader.START);
	});

	t.test('携带参数', t => {
		const wm = new WorkerManagerSync<5>();
		wm.add(Loader.START, context => {
			t.equal(
				context.data,
				5,
				'包含上下文'
			);
			t.end();
		});
		const wr = wm.getRunner(5);
		wr.run(Loader.START);
	});

	t.test('修改参数', t => {
		const wm = new WorkerManagerSync<number>();
		wm.add(Loader.START, context => {
			t.equal(
				context.data,
				123,
				'符合初始值'
			);
			context.data = 321;
		});
		wm.add(Loader.START, context => {
			t.equal(
				context.data,
				321,
				'成功修改值'
			);
		});
		wm.add(Loader.START, () => t.end());
		const wr = wm.getRunner(123);
		wr.run(Loader.START);
	});

	t.end();
});

test('##异步函数', t => {

	t.test('普通回调', t => {
		t.plan(1);
		const wm = new WorkerManagerAsync<void>();
		wm.add(Loader.START, { run: async () => t.pass('函数运行') });
		const wr = wm.getRunner(void 0, 0);
		wr.run(Loader.START);
	});

	t.test('携带参数', t => {
		const wm = new WorkerManagerAsync<5>();
		wm.add(Loader.START, async context => {
			t.equal(
				context.data,
				5,
				'包含上下文'
			);
			t.end();
		});
		const wr = wm.getRunner(5, 0);
		wr.run(Loader.START);
	});

	t.test('连续回调', t => {
		const wm = new WorkerManagerAsync<number>();
		wm.add(Loader.START, async context => {
			t.equal(
				context.data,
				1,
				'第一次被执行'
			);
			context.data++;
		});
		wm.add(Loader.START, async context => {
			t.equal(
				context.data,
				2,
				'第二次被执行'
			);
		});
		wm.add(Loader.START, () => t.end());
		const wr = wm.getRunner(1, 0);
		wr.run(Loader.START);
	});

	t.test('并行回调', t => {
		t.plan(6);
		const wm = new WorkerManagerAsync<number>();
		wm.add(Loader.START, async context => {
			await to(5);
			t.equal(
				context.data,
				1,
				'并行执行中'
			);
		});
		wm.add(Loader.END, async context => {
			context.data++;
			t.pass('先启动了');
			await to(10);
			t.pass('后结束了');
			context.data--;
		});
		const wr0 = wm.getRunner(0, 0);
		wr0.run(Loader.END);
		wr0.run(Loader.START);
		const wr1 = wm.getRunner(0, 0);
		wr1.run(Loader.START);
		wr1.run(Loader.END);
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
		wm.add(Loader.START, a);
		wm.add(Loader.END, a);
		wm.add(Loader.UNKNOWN, a);
		const wr0 = wm.getRunner(0, 2);
		wr0.run(Loader.END);
		wr0.run(Loader.START);
		wr0.run(Loader.UNKNOWN);
	});

	t.test('跳过空值', t => {
		const wm = new Twma<void>();
		const l0 = new Queue({ autostart: true, concurrency: 0 });
		const wr0 = new Twra(l0, wm.get().wm, void 0);
		wr0.run(Loader.START);
		t.equal(
			l0.length,
			0,
			'没使用任何队列资源'
		);
		wm.add(Loader.END, []);
		const l1 = new Queue({ autostart: true, concurrency: 0 });
		const wr1 = new Twra(l1, wm.get().wm, void 0);
		wr1.run(Loader.END);
		t.equal(
			l1.length,
			0,
			'没使用任何队列资源'
		);
		t.end();
	});

	t.end();
});

