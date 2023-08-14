/**
 * 树操作工具库
 * @module mcdjs/lib/magast/util
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './util';

import { regEnum, initText, sureObj } from '../config/text';

export const some = initText({
	report: {
		'zh-CN': '转义中出现错误',
	},
});

export enum TransfSignal {
	Stop,
	Next,
}
export const tranumTransfSignal = regEnum('TransfSignal', TransfSignal, {
	Stop: '中断遍历',
	Next: '结束当前函数',
});
export class TransfError extends Error {
	static assert(err: unknown): asserts err is TransfError {
		if (!(err instanceof TransfError)) throw err;
	}
	constructor(signal: TransfSignal) {
		super(sureObj(some.report), { cause: { signal, info: tranumTransfSignal(signal) } });
	}
	declare cause: { signal: TransfSignal, info: string; };
}
export function guard(n: boolean): asserts n {
	if (!n) throw new TransfError(TransfSignal.Stop);
}
