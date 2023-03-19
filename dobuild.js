/**
 * 自动化构建脚本
 * @license GPL-3.0-or-later
 */
"use strict";
const {
	snake,
	mkdir,
	exec,
	mvs,
	cmt,
	dels,
	outFS,
	log,
	match,
	judge,
	comp,
	goodReg,
	time,
	timeEnd,
	timeStart,
} = require('lethal-build')(__dirname);
const fsp = require('fs/promises');
require('promise-snake');

const mn = [];
const mv = [
	'cli',
];
snake(
	timeStart(),
	dels('build'),
	exec('npm exec tsc'),
	timeEnd(),
	log('\nTS compiled in', time(), 'ms\n'),
	judge(process.argv[process.argv.length - 1] === '-prod'),
	timeStart(),
	async () => Object.keys(require('./build')).forEach(e => e != 'default' && mn.push(e)),
	exec('npm exec webpack'),
	mkdir('temp'),
	outFS([
		[1, cmt('lib/index.ts')],
		[1, '((exp)=>{'],
		[0, 'build/packed.js'],
		[1, '})(typeof module==="undefined"?false:module);']
	], 'temp/index.js'),
	timeEnd(),
	log('\nwebpack compiled in', time(), 'ms\n'),
	mvs(mv.map(e => [`build/${e}`, `temp/${e}`])),
	dels([
		RegExp(`^${goodReg(comp('build'))}.*js$`),
		'build/exp.d.ts',
	]),
	mvs(['temp', 'build']),
	() => Promise.thens(mn.map(m =>
		fsp.writeFile(`build/${m}.js`, `module.exports=require('.').${m};`)
	)),
	timeEnd(),
	log('\nBuilt in', time(), 'ms\n')
).then(() => process.exit(0));
