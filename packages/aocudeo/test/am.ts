import Queue from "queue";
import test from "tape";
import { ActionMapAsync, ActionMapSync, Loader } from '..';

test('##同步函数', t => {
	t.test('普通回调', t => {
		t.plan(1);
		const am = new ActionMapSync<void>();
		am.add(Loader.START, () => t.pass('函数运行'));
		am.run(am.getHookedLoaderThis(), Loader.START);
	});

	t.test('多个回调', t => {
		t.plan(2);
		const am = new ActionMapSync<void>();
		am.add(Loader.START, () => t.pass('第一个函数'));
		am.add(Loader.START, () => t.pass('第二个函数'));
		am.run(am.getHookedLoaderThis(), Loader.START);
	});

	t.test('携带参数', t => {
		const am = new ActionMapSync<5>();
		am.add(Loader.START, function () {
			t.equal(
				this.context,
				5,
				'包含上下文'
			);
			t.end();
		});
		am.run(am.getHookedLoaderThis(5), Loader.START);
	});

	t.end();
});

test.only('hh', t => {
	t.plan(1);
	const am = new ActionMapAsync<void>();
	am.add(Loader.START, async function () {
		t.pass('函数运行');
	});
	am.run(am.getHookedLoaderThis(), Loader.START, new Queue({ autostart: true }));
});

test('##异步函数', t => {

	test('普通回调', t => {
		t.plan(1);
		const am = new ActionMapAsync<void>();
		am.add(Loader.START, async () => t.pass('函数运行'));
		am.run(am.getHookedLoaderThis(), Loader.START, new Queue({ autostart: true }));
		t.timeoutAfter(100);
	});

	test('多个回调', t => {
		t.plan(2);
		const am = new ActionMapAsync<void>();
		let i = 0;
		am.add(Loader.START, async () => {
			t.equal(
				i,
				0,
				'第一次被执行'
			);
		});
		am.add(Loader.START, async () => {
			i++;
			t.pass('第二个函数');
		});
		am.run(am.getHookedLoaderThis(), Loader.START, new Queue({ autostart: true }));
	});

	test('携带参数', t => {
		const am = new ActionMapAsync<5>();
		am.add(Loader.START, async function () {
			t.equal(
				this.context,
				5,
				'包含上下文'
			);
			t.end();
		});
		am.run(am.getHookedLoaderThis(5), Loader.START, new Queue({ autostart: true }));
	});

	test('并行执行', t => {
		t.plan(3);
		const am = new ActionMapAsync<void>();
		let i = 0;
		am.add(Loader.START, async () => {
			await new Promise(res => setTimeout(res, 5));
			t.equal(
				i,
				1,
				'并行函数'
			);
		});
		am.add(Loader.END, async () => {
			i++;
			t.pass('先启动函数');
			await new Promise(res => setTimeout(res, 10));
			t.pass('后结束函数');
			i--;
		});
		const q = new Queue({ autostart: true, concurrency: 2 });
		const lt = am.getHookedLoaderThis();
		am.run(lt, Loader.START, q);
		am.run(lt, Loader.END, q);
	});

	t.end();
});

