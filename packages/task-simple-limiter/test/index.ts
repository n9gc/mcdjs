import Limiter from "..";
import test from 'tape';

class Tl extends Limiter {
	get = () => ({
		cn: this.concurrencyNow,
		w: this.waiters,
		i: this.idleIds,
	});
}

test('初始测试', t => {
	const a = new Tl({ concurrency: 2 });

	const b = new Tl(a);
	t.equal(a, b, '返回实例');

	const c = new Tl();
	c.concurrency = 2;
	t.deepEqual(a.concurrency, c.concurrency, '构造属性');

	t.end();
});

test('静态增减测试', t => {

	const a = new Tl({ concurrency: 2 });
	t.deepEqual([
		a.get().cn,
		a.get().i,
	], [
		2,
		[1, 2],
	], '# 初始结构');

	a.concurrency = 3;
	a.checkIdle();
	t.deepEqual([
		a.get().cn,
		a.get().i,
	], [
		3,
		[1, 2, 3],
	], '# 增加并发');

	a.concurrency = 1;
	a.checkIdle();
	t.deepEqual([
		a.get().cn,
		a.get().i,
	], [
		1,
		[1],
	], '# 减少并发');

	t.end();
});

test('延时测试', t => {
	t.plan(1);

	const a = new Limiter({ concurrency: 2 });
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
