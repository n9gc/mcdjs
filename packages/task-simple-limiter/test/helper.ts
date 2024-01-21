/**
 * 方便测试的工具
 */

import Limiter from "..";

export class Tl extends Limiter {
	get = () => ({
		w: this.waiters,
	});
}
