import test from 'tape';
import type { Id } from '../../lib/types';
import { getArray, isArray, isIdArray, mapMap } from '../../lib/util';

test('数组处理', t => {
	t.ok(isArray([]), '是数组');
	t.notok(isArray('asd'), '不是数组');

	t.deepEqual(getArray('asd'), ['asd'], '生成数组');
	t.deepEqual(getArray(['asd']), ['asd'], '返回数组');
	const a = ['asd'];
	t.equal(getArray(a), a, '引用相同');

	t.ok(isIdArray([]), '不是');
	t.ok(isIdArray(['asd']), '不是');
	t.ok(isIdArray([Symbol('asd')]), '不是');
	t.ok(isIdArray([123]), '不是');
	t.notok(isIdArray([[]]), '是');
	t.notok(isIdArray([['asd']]), '是');
	t.notok(isIdArray([[Symbol('asd')]]), '是');
	t.notok(isIdArray([[123]]), '是');

	t.end();
});

test('遍历对象', t => {
	const ans = new Set([
		{ k: 'a', v: 0 },
		{ k: 'b', v: 1 },
		{ k: 'c', v: 2 },
	]);

	const a = {
		a: 0,
		b: 1,
		c: 2,
		d: void 0,
	};
	const r0 = new Set<{ v: number, k: Id; }>;
	mapMap(a, (v, k) => r0.add({ v, k }));
	t.deepEqual(r0, ans, '遍历普通对象正确');

	const b = new Map([['a', 0], ['b', 1], ['c', 2]]);
	const r1 = new Set<{ v: number, k: Id; }>;
	mapMap(b, (v, k) => r1.add({ v, k }));
	t.deepEqual(r1, ans, '遍历表正确');

	t.end();
});
