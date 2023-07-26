/**
 * 自动化构建脚本
 * @license GPL-2.0-or-later
 */
"use strict";
import * as fsp from 'fs/promises';
import LBIniter from 'lethal-build';
import 'promise-snake';
const {
	snake,
	mkdir,
	exec,
	mvs,
	cmt,
	dels,
	outFS,
	log,
	comp,
	goodReg,
	time,
	timeEnd,
	timeStart,
} = LBIniter(__dirname);

const mn: string[] = [];
snake(
	timeStart(),
	exec(`pnpm tsc`),
	timeEnd(),
	log<any>('\nTS compiled in', time(), 'ms\n'),
	timeStart(),
	async () => Object.keys(require('./lib/index.ts')).forEach(e => e != 'default' && mn.push(e)),
	exec('pnpm webpack'),
	mkdir('temp'),
	outFS([
		[1, cmt('lib/index.ts')],
		[1, '((exp)=>{'],
		[0, 'lib/packed.js'],
		[1, '})(typeof module==="undefined"?false:module);'],
	], 'temp/index.js'),
	timeEnd(),
	log<any>('\nwebpack compiled in', time(), 'ms\n'),
	dels(RegExp(`${goodReg(comp('lib'))}[\\/\\\\].*js$`)),
	() => mn.forEachAsync(m => fsp.writeFile(`temp/${m}.js`, `module.exports=require('.').${m};`)),
	mvs(['temp', 'lib']),
	timeEnd(),
	log<any>('\nBuilt in', time(), 'ms\n')
).then(() => process.exit(0));
