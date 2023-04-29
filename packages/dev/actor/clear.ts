/**
 * 清理目录
 * @module @mcdjs/dev/tester/all
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './clear';

import Initer from 'lethal-build';
import * as path from 'path';
import checkrun from '../tool/checkrun';

const {
	dir,
	snake,
	dels,
	goodReg,
	timeEnd,
	time,
	log,
} = Initer(path.resolve());

export default function def() {
	return snake(
		dels(RegExp(`${goodReg(dir + path.sep)}.*(\.d\.ts|\.js|\.js\.map)$`)),
		timeEnd(),
		log<any>('Clear successfully in', time(), 'ms')
	);
}

checkrun(def);
