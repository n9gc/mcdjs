import test from 'tape';
import { WorkerContextMaker } from '..';

test('上下文对象', t => {
	const wcm = new WorkerContextMaker<number>(123);
	const wc0 = wcm.make('hh0');
	t.equal(
		wc0.id,
		'hh0',
		'id符合'
	);
	const wc1 = wcm.make('hh1');
	t.equal(
		wc1.id,
		'hh1',
		'id符合'
	);
	wc0.data = 345;
	t.equal(
		wc1.data,
		345,
		'参数共享'
	);
	t.end();
});

