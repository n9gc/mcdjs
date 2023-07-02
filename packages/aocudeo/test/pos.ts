import test, { Macro } from 'ava';
import { PositionMap, Loader, Id } from '..';
import { Tpm, gsm, car } from './helpers';
import expect from 'expect';

const cer: Macro<[
	init: (pm: PositionMap<void>) => void,
	deeperlySplited: string[],
	withPosInfo?: Id[]
], unknown> = {
	exec(t, init, ss, di = []) {
		// 初始化
		const pm = new Tpm();
		init(pm);

		// 都能正常拆分 
		expect(car(pm.get().sc.get().en)).toEqual(car(ss));

		// 拆分后都被保证
		const enl = [
			Loader.START, Loader.END,
			ss,
			...ss.map(n => Loader.getAffixs().map(a => a + n)),
		].flat();
		expect(car(pm.get().ic.get().en)).toEqual(car(enl));
		
		// 只留子节点的位置
		const h = new Set<string>();
		ss.forEach(n => h.add('pre:' + n).add('main:' + n).add('post:' + n).delete(n));
		const spmo = gsm([...h], {} as any);

		// 处理不为空的标识
		[...di, Loader.END].forEach(i => spmo[i] = pm.get().spm[i]);
		expect(pm.get().spm).toEqual(spmo);

		// 结束
		t.pass();
	}
};

test(
	'单独一个',
	cer,
	pm => {
		pm.insert('hh1', {});
	},
	['hh1'],
);

test(
	'简单两个',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh2', 'hh1');
	},
	['hh1', 'hh2'],
	['pre:hh2'],
);

test(
	'补充添加',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh2', 'hh1');
		pm.insert('hh2', { before: 'hh1' });
	},
	['hh1', 'hh2'],
	['pre:hh2', 'post:hh2'],
);

test(
	'插后拆分',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh2', 'hh1');
		pm.insert('pre:hh2', {});
	},
	['hh1', 'hh2', 'pre:hh2'],
	['pre:pre:hh2'],
);

test(
	'插前拆分',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('pre:hh2', {});
		pm.insert('hh2', 'hh1');
	},
	['hh1', 'hh2', 'pre:hh2'],
	['pre:pre:hh2'],
);

test(
	'简单钩子',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh2', { postOf: 'hh1' });
		pm.insert('hh3', { preOf: 'hh1' });
	},
	['hh1', 'hh2', 'hh3'],
	['pre:hh3', 'post:hh3', 'pre:hh2', 'post:hh2'],
);

test(
	'儿子生爸',
	cer,
	pm => {
		pm.insert('pre:pre:hh2', {});
	},
	['hh2', 'pre:hh2', 'pre:pre:hh2'],
);

test(
	'索取拆分',
	cer,
	pm => {
		pm.insert('hh1', {});
		pm.insert('hh4', 'pre:pre:hh1')
	},
	['hh1', 'pre:hh1', 'hh4'],
	['pre:hh4', 'post:hh4'],
);

test(
	'占取拆分',
	cer,
	pm => {
		pm.insert('hh4', 'pre:hh1')
		pm.insert('hh4', 'pre:pre:hh1')
		pm.insert('hh1', {});
	},
	['hh1', 'pre:hh1', 'hh4'],
	['pre:hh4', 'post:hh4'],
);
