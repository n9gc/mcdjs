/**
 * 命令集初始化信息
 * @module mcdjs/lib/cmdobj/init
 * @version 1.0.1
 * @license GPL-2.0-or-later
 */
/// <reference path="./base.ts" />
/// <reference path="./lib.ts" />
declare module './init';
declare global {
	namespace McdJSTemp {
		/**
		 * McdJS 命令集
		 * @license GPL-2.0-or-later
		 */
		namespace Command {
			/**版本信息 */
			namespace Ver { }
		}
		/**命令集间接操作相关 */
		namespace chCommand { }
	}
}

import { loader } from '../alload';

loader.insert('cmdobj', {
	after: 'struct',
}, () => {
	require('./base');
	require('./lib');
});
