import Queue from 'queue';
import test from 'tape';
import { Twra, Twrs } from '../helpers';

function cer(Twr: typeof Twrs | typeof Twra) {
	return (t: test.Test) => {
		const wcm = new Twr<number>(new Map(), 123, new Queue);
		const wc0 = wcm.get().mc('hh0');
		t.equal(
			wc0.id,
			'hh0',
			'id符合'
		);
		const wc1 = wcm.get().mc('hh1');
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
	}
}

test('##同步上下文对象', cer(Twrs));

test('##异步上下文对象', cer(Twrs));

