import test from 'tape';
import { Id, Organizer, OrganizerSync } from '..';
import { csz } from './helpers';

function cge(sign: boolean) {
	return (k: [Id, Id][], init?: (o: OrganizerSync) => void) => {
		return (t: test.Test) => {
			const c = k.map((([a, b]) => `\t"${a.toString()}" -> "${b.toString()}"`));
			const o = new OrganizerSync();
			init?.(o);
			const m = o.getDiagram().getDot(sign).split('\n').slice(1, -1);
			const { rc, rm } = csz(m, c);
			t.deepEqual(
				rc,
				[],
				'未缺失'
			);
			t.deepEqual(
				rm,
				[],
				'未多余'
			);
			console.log(o.getDiagram().getUrl(sign));
			t.end();
		};
	};
}


test('## 带起终点图示', t => {
	const cer = cge(true);

	t.test('空转检查', cer(
		[
			[Organizer.start, Organizer.end],
		],
	));

	t.test('简单标识', cer(
		[
			[Organizer.start, Organizer.end],
			[Organizer.start, Symbol.for('a')],
			[Organizer.start, Symbol.for('b')],
			[Symbol.for('a'), Organizer.end],
			[Symbol.for('b'), Organizer.end],
			[Symbol.for('b'), Symbol.for('a')],
		],
		o => {
			o.addPositions({
				[Symbol.for('a')]: Symbol.for('b'),
				[Symbol.for('b')]: [],
			});
		}
	));

	t.test('简单钩子', cer(
		[
			[Organizer.start, Organizer.end],
			[Organizer.start, 'pre:hh'],
			['post:hh', Organizer.end],
			['pre:hh', 'main:hh'],
			['main:hh', 'post:hh'],
		],
		o => {
			o.addPosition('hh', {});
		}
	));

	t.test('复杂钩子', cer(
		[
			[Organizer.start, Organizer.end],
			[Organizer.start, 'pre:pre:pre:hh'],
			['pre:pre:pre:hh', 'main:pre:pre:hh'],
			['main:pre:pre:hh', 'post:pre:pre:hh'],
			['post:pre:pre:hh', 'main:pre:hh'],
			['main:pre:hh', 'post:pre:hh'],
			['post:pre:hh', 'main:hh'],
			['main:hh', 'pre:post:hh'],
			['pre:post:hh', 'pre:main:post:hh'],
			['pre:main:post:hh', 'main:main:post:hh'],
			['main:main:post:hh', 'pre:post:main:post:hh'],
			['pre:post:main:post:hh', 'main:post:main:post:hh'],
			['main:post:main:post:hh', 'post:post:main:post:hh'],
			['post:post:main:post:hh', 'post:post:hh'],
			['post:post:hh', Organizer.end],
		],
		o => {
			o.addPosition('pre:pre:hh', {});
			o.addPosition('post:main:post:hh', {});
		}
	));

	t.end();
});

test('## 不带起终点图示', t => {
	const cer = cge(false);

	t.test('空转检查', cer(
		[],
	));

	t.test('简单标识', cer(
		[
			[Symbol.for('b'), Symbol.for('a')],
		],
		o => {
			o.addPositions({
				[Symbol.for('a')]: Symbol.for('b'),
				[Symbol.for('b')]: [],
			});
		}
	));

	t.test('简单钩子', cer(
		[
			['pre:hh', 'main:hh'],
			['main:hh', 'post:hh'],
		],
		o => {
			o.addPosition('hh', {});
		}
	));

	t.test('复杂钩子', cer(
		[
			['pre:pre:pre:hh', 'main:pre:pre:hh'],
			['main:pre:pre:hh', 'post:pre:pre:hh'],
			['post:pre:pre:hh', 'main:pre:hh'],
			['main:pre:hh', 'post:pre:hh'],
			['post:pre:hh', 'main:hh'],
			['main:hh', 'pre:post:hh'],
			['pre:post:hh', 'pre:main:post:hh'],
			['pre:main:post:hh', 'main:main:post:hh'],
			['main:main:post:hh', 'pre:post:main:post:hh'],
			['pre:post:main:post:hh', 'main:post:main:post:hh'],
			['main:post:main:post:hh', 'post:post:main:post:hh'],
			['post:post:main:post:hh', 'post:post:hh'],
		],
		o => {
			o.addPosition('pre:pre:hh', {});
			o.addPosition('post:main:post:hh', {});
		}
	));

	t.end();
});