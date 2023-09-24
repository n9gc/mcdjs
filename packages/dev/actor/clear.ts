/**
 * 清理目录
 * @module @mcdjs/dev/tester/all
 * @version 1.1.0
 * @license GPL-2.0-or-later
 */
declare module './clear';

import Initer from 'lethal-build';
import * as path from 'path';
import checkrun from '../tool/checkrun';

const lb = Initer(path.resolve());
const {
	dir,
	snake,
	dels,
	goodReg,
	timeEnd,
	time,
	log,
	ignoreList,
} = lb;

export default function def(ignores: string[]) {
	lb.ignoreList = [...ignores, ...ignoreList];
	return snake(
		dels(RegExp(`${goodReg(dir + path.sep)}.*(\\.d\\.ts|\\.js|\\.js\\.map)$`)),
		timeEnd(),
		log<any>('Clear successfully in', time(), 'ms')
	);
}

checkrun(def);
