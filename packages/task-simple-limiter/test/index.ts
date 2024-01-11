import Limiter, { Releaser } from "..";
import test from 'tape';

class Tl extends Limiter {
	get = () => ({
		w: this.waiters,
	});
}

test('构造测试', t => {
	const a = new Tl({ concurrency: 123 });

	const b = new Tl(a);
	t.equal(a, b, '返回实例');

	const c = new Tl();
	c.concurrency = 123;
	t.deepEqual(a.concurrency, c.concurrency, '构造属性');

	t.end();
});

test('默认无限并发', async t => {
	async function r(a: Tl, n: number) {
		const resp = Promise.all(Array(n).fill(() => a.hold()).map(f => f()));
		await new Promise(res => setTimeout(res));
		t.equal(a.running, n, `${n} 并发`);
		await resp.then(res => res.forEach(re => re()));
	}

	const b = new Tl();
	await r(b, 3);
	await r(b, 10);
	await r(b, 50);

	const c = new Tl({ concurrency: -1 });
	await r(c, 3);
	await r(c, 10);
	await r(c, 50);

	t.end();
});

test('防止重复释放', async t => {
	const a = new Tl();
	const re = await a.hold();
	re();
	t.equal(a.running, 0, '已释放');
	a.hold();
	re();
	t.notEqual(a.running, 0, '未重复释放');
});

test('阻塞所有任务', async t => {
	const a = new Tl();
	const re = await a.hold();
	a.concurrency = 0;
	a.hold();
	re();
	t.equal(a.get().w.length, 1, '被阻塞');
	a.concurrency = Infinity;
	t.equal(a.get().w.length, 0, '通畅了');
});

test('延时测试', t => {
	t.plan(1);

	async function to(t: number, i?: any) {
		await new Promise(res => setTimeout(res, t));
		i && infos.push(i);
	}
	const infos: string[] = [];
	let fnNo = 0;
	async function runAsync(time: number, con: number | null = null) {
		let no = fnNo++;
		await a.run(() => to(time, `${no}_in`));
		infos.push(`${no}_out`);
	}

	const a = new Limiter({ concurrency: 2, autoCheckIdle: false });
	const timer = setInterval(() => infos.push('---'), 300);

	runAsync(300);
	runAsync(300);
	runAsync(300);
	runAsync(300);
	runAsync(300);
	runAsync(300);
	runAsync(300);
	runAsync(300);
	runAsync(300).then(() => {
		clearInterval(timer);
		t.deepEqual(infos, [
			'---',
			'0_in',
			'0_out',
			'1_in',
			'1_out',
			'---',
			'2_in',
			'2_out',
			'3_in',
			'3_out',
			'---',
			'4_in',
			'4_out',
			'5_in',
			'5_out',
			'6_in',
			'6_out',
			'---',
			'7_in',
			'7_out',
			'---',
			'---',
			'8_in',
			'8_out',
		], '顺序正确');
	});

	setTimeout(() => a.concurrency = 3, 450);
	setTimeout(() => a.concurrency = 1, 750);
	setTimeout(() => a.concurrency = 0, 1050);
	setTimeout(() => {
		a.concurrency = 1;
		a.checkIdle();
	}, 1600);
});
