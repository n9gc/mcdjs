/**
 * 批量测试
 * @module @mcdjs/dev/tester/all
 * @version 1.3.0
 * @license GPL-3.0-or-later
 */
declare module './all';

import { resolve } from 'path';
import 'promise-snake';
import checkrun from '../tool/checkrun';

export default function def(fileList: string[]) {
	fileList.forEachAsync(file => import(resolve(file)));
}

checkrun(def);
