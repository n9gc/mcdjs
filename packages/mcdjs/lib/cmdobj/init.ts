/**
 * 命令集初始化信息
 * @module mcdjs/lib/cmdobj/init
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
/// <reference path="./base.ts" />
/// <reference path="./lib.ts" />
declare module './init';
declare global {
	namespace McdJSTemp {
		/**
		 * McdJS 命令集
		 * @license GPL-3.0-or-later
		 */
		namespace Command {
			/**版本信息 */
			namespace Ver { }
		}
		/**命令集间接操作相关 */
		namespace chCommand { }
	}
}

import type { Info } from '../alload';

export const infoCmdobj: Info = {
	id: 'cmdobj',
	after: 'struct',
	act() {
		require('./base');
		require('./lib');
	},
};
