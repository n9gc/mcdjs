import test from 'tape';
import { ArrayMap, InitializableMap, SurePositionMap } from '../../lib/util';
import type { AddonFn } from '../helpers';

function cer<T>(iM: InitializableMap<string, T>, fn?: AddonFn) {
	return (t: test.Test) => {
		t.notOk(iM.has('asd'), '未初始化');
		iM.get('asd');
		const a = iM.forceGet('asd');
		t.deepEqual(a, (<any>iM).initializeValue(), '强制初始化');
		t.deepEqual(a, iM.forceGet('asd'), '只初始化一次');
		fn?.(t);
		t.end();
	};
}

test('基本类', cer(
	new class IM extends InitializableMap<string, { a: number; }> {
		protected initializeValue() { return { a: 8877 }; }
	}
));

test('位置表', cer(new SurePositionMap));

test('数组表', cer(new ArrayMap, (t) => {
	const a = new ArrayMap<string, number>();
	a.push('asd', 123, 234);
	t.deepEqual(a.get('asd'), [123, 234]);
}));
