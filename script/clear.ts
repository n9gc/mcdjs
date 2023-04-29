import Initer from 'lethal-build';
import * as path from 'path';

const {
	dir,
	snake,
	dels,
	goodReg,
	timeEnd,
	time,
	log,
} = Initer(path.resolve());

snake(
	dels(RegExp(`${goodReg(dir + path.sep)}.*(\.js|\.js\.map)$`)),
	timeEnd(),
	log<any>('Clear successfully in', time(), 'ms')
);
