import Limiter, { Releaser } from "..";
import test from 'tape';

class Tl extends Limiter {
	get = () => ({
		cn: this.concurrencyNow,
		w: this.waiters,
		// i: this.idleIds,
		is: new Set(this.idleIds),
	});
}

/**强制填充全部空闲编号 */
async function gl(n: Tl, num = 2 * n.concurrency) {
	let i = 0;
	const res: Releaser[] = [];
	while (i++ < num) n.hold().then(re => res.push(re));
	await new Promise(res => setTimeout(res));
	for (const re of res) {
		await new Promise(res => setTimeout(res));
		re();
	}
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

test('初始结构', async t => {
	const a = new Tl({ concurrency: 2 });

	t.deepEqual([
		a.get().cn,
		a.get().is,
	], [
		0,
		new Set(),
	], '空白初始');

	await gl(a);
	t.deepEqual([
		a.get().cn,
		a.get().is,
	], [
		2,
		new Set([1, 2]),
	], '占用后初始');
});

test('静态增加并发', async t => {
	const a = new Tl({ concurrency: 2 });
	await gl(a);

	a.concurrency = 4;
	a.checkIdle();

	t.deepEqual([
		a.get().cn,
		a.get().is,
	], [
		2,
		new Set([1, 2]),
	], '空白增加');

	await gl(a);
	t.deepEqual([
		a.get().cn,
		a.get().is,
	], [
		4,
		new Set([1, 2, 3, 4]),
	], '占用后增加');
});

test('静态减少并发', async t => {
	const a = new Tl({ concurrency: 4 });
	await gl(a);

	a.concurrency = 2;
	a.checkIdle();

	t.deepEqual([
		a.get().cn,
		a.get().is,
	], [
		2,
		new Set([1, 2]),
	], '空白增加');
});

test('无限并发', async t => {
	async function r(a: Tl, n: number) {
		await gl(a, n);
		t.deepEqual([
			a.get().cn,
			a.get().is,
		], [
			n,
			new Set(Array(n).fill(0).map((_, i) => i + 1)),
		], `${n} 并发`);
	}

	const a = new Tl();
	await r(a, 3);
	await r(a, 10);
	await r(a, 50);

	const b = new Tl({ concurrency: Infinity });
	await r(b, 3);
	await r(b, 10);
	await r(b, 50);
	t.end();
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
		const release = await a.hold();
		await to(time, `${no}_in`);
		release();
		infos.push(`${no}_out`);
	}

	const a = new Limiter({ concurrency: 2 });
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
			'8_in',
			'8_out',
		], '顺序正确');
	});

	setTimeout(() => a.concurrency = 3, 450);
	setTimeout(() => a.concurrency = 1, 750);
});
