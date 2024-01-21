import test from 'tape';
import { AocudeoError, ErrorType, mapMapObj, throwError } from '../../lib/util';

test('错误对象', t => {
	mapMapObj<ErrorType, keyof typeof ErrorType>(ErrorType, (v, k) => {
		if (typeof v === 'string') return;
		const c = Error();
		const i = Symbol('info');
		const e = new AocudeoError(ErrorType[k], c, { i });
		t.equal(e.type, k, '翻译过的类型');
		t.equal(e.tracker, c, '追踪器绑定');
		t.equal((<any>e).i, i, '信息补充');
		t.throws(() => throwError(v, c), '成功抛出');
	});

	t.end();
});
