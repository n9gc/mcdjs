/**
 * 清理目录
 * @version 1.2.0
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

export default function def(ignores: string[] = [], patterns: (string | RegExp)[] = []) {
	lb.ignoreList = [...ignores, ...ignoreList];
	const tempReg = RegExp(`${goodReg(dir + path.sep)}.*(\\.d\\.ts|\\.js|\\.js\\.map)$`);
	return snake(
		dels(lb.match([...patterns, tempReg])),
		timeEnd(),
		log<any>('Clear successfully in', time(), 'ms')
	);
}

checkrun(def);
