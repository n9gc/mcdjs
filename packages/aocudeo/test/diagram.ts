import test from 'tape';
import { PositionMap } from '../lib/position';
import type { Id } from '../lib/types';
import { csz } from './helpers';

import { Organizer } from '../lib/organizer';

function cge(sign: boolean) {
	return (k: [Id, Id][], init?: (o: PositionMap) => void) => {
		return (t: test.Test) => {
			const c = k.map((([a, b]) => `\t"${a.toString()}" -> "${b.toString()}"`));
			const o = new PositionMap();
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
		p => {
			p.insert(Symbol.for('a'), Symbol.for('b'));
			p.insert(Symbol.for('b'), {});
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
		p => {
			p.insert('hh', {});
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
		p => {
			p.insert('pre:pre:hh', {});
			p.insert('post:main:post:hh', {});
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
		p => {
			p.insert(Symbol.for('a'), Symbol.for('b'));
			p.insert(Symbol.for('b'), {});
		}
	));

	t.test('简单钩子', cer(
		[
			['pre:hh', 'main:hh'],
			['main:hh', 'post:hh'],
		],
		p => {
			p.insert('hh', {});
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
		p => {
			p.insert('pre:pre:hh', {});
			p.insert('post:main:post:hh', {});
		}
	));

	t.end();
});
