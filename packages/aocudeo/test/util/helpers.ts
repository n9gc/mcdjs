import { ErrorType } from "../../lib/util";

/**代为运行函数并处理抛出的问题 */
export function aeh(fn: () => void) {
	return () => {
		try { fn(); }
		catch (err: any) {
			err = { ...err };
			// 翻译错误类型
			err.type = ErrorType[err.type];
			// 删除多余追踪信息
			delete err.tracker;
			// 把数组变成集合
			if ('list' in err) err.list = new Set(err.list);
			if ('circle' in err) err.circle = new Set(err.circle);
			throw err;
		}
	};
}