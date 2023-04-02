/**
 * 条件判断运算转译模块
 * @module mcdjs/lib/transf/cond
 * @version 0.1.0
 * @license GPL-3.0-or-later
 */
declare module './cond';

import { Struct } from '../alload';
import { NType } from '../genast';
import { TransfModule } from './types';
import Tag = Struct.Tag;

const mod: TransfModule = {
	'Branch|CodeBlock'(path) {
		console.log(path);
	}
};
export default mod;
