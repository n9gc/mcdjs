/**
 * 自动化构建脚本
 * @license GPL-2.0-or-later
 */
"use strict";
import LBIniter from 'lethal-build';
import 'promise-snake';
const {
	snake,
	exec,
	cmt,
	dels,
	outFS,
	log,
	time,
	timeEnd,
	timeStart,
} = LBIniter(__dirname);

snake(
	timeStart(),
	exec('pnpm webpack'),
	outFS([
		[1, cmt('lib/index.ts')],
		[1, '((exp)=>{'],
		[0, 'packed.js'],
		[1, '})(typeof module==="undefined"?false:module);'],
	], 'browser.js'),
	dels('packed.js'),
	timeEnd(),
	log<any>('\nwebpack compiled in', time(), 'ms\n'),
	timeEnd(),
	log<any>('\nBuilt in', time(), 'ms\n')
).then(() => process.exit(0));
