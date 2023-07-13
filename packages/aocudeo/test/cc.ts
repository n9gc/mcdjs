import test from 'tape';
import { CircleChecker, Id, Organizer } from '..';
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
			[Organizer.start],
		],
		false,
	));

	t.test('简单小环', cer(
		[
			[Organizer.start, ['hh']],
			['hh', [Organizer.start]],
		],
		[Organizer.start, 'hh'],
	));

	t.test('记忆检查', cer(
		[
			['end'],
			['xp', ['end']],
			['hh0', ['xp']],
			['hh1', ['xp']],
			[Organizer.start, ['hh0', 'hh1']],
		],
		false
	));

	t.test('深处小环', cer(
		[
			[Organizer.start, ['entry']],
			['entry', ['hh0']],
			['hh0', ['hh1']],
			['hh1', ['hh0']],
		],
		['hh0', 'hh1']
	));

	t.end();
});

