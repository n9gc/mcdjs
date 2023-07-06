import test from 'tape';
import { CircleChecker, Id, Loader } from '..';
import { mm, nem } from './helpers';

function cer(liv: [Id, Id[]?][], r: Id[] | false) {
	return (t: test.Test) => {
		const em = mm(true, nem(liv).map(([i, s]) => [i, [...s]] as const));
		const { result } = new CircleChecker(em);
		if (!result) {
			t.equal(
				result,
				r,
				'应安全'
			);
		} else {
			const n = new Set(result);

			t.equal(
				result.length,
				n.size,
				'不包含重复节点'
			)
			t.deepEqual(
				n,
				r && new Set(r),
				'检查结果正确'
			);
		}
		t.end();
	};
}

test('##圆圈检查', t => {
	t.test('空转检查', cer(
		[
			[Loader.START],
		],
		false,
	));

	t.test('简单小环', cer(
		[
			[Loader.START, ['hh']],
			['hh', [Loader.START]],
		],
		[Loader.START, 'hh'],
	));

	t.test('记忆检查', cer(
		[
			['end'],
			['xp', ['end']],
			['hh0', ['xp']],
			['hh1', ['xp']],
			[Loader.START, ['hh0', 'hh1']],
		],
		false
	));

	t.test('深处小环', cer(
		[
			[Loader.START, ['entry']],
			['entry', ['hh0']],
			['hh0', ['hh1']],
			['hh1', ['hh0']],
		],
		['hh0', 'hh1']
	));

	t.end();
});

