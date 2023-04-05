/**
 * 条件判断运算插件
 * @module mcdjs/lib/transf/internal-cond
 * @version 0.1.1
 * @license GPL-3.0-or-later
 */
declare module './internal-cond';

import { Struct } from '../alload';
import { NType } from '../genast';
import { TransfModule } from './types';
import Tag = Struct.Tag;

const mod: TransfModule = {
	'all'(path) {
		// console.log(path);
	}
};
export default mod;
