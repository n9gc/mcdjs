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
	comp,
	goodReg,
	time,
	timeEnd,
	timeStart,
} = require('lethal-build')(__dirname);
const fsp = require('fs/promises');
require('promise-snake');

const mn = [];
const prod = process.argv[process.argv.length - 1] === '-prod';
if (!prod) snake(
	timeStart(),
	dels(['dist', 'tsconfig.tsbuildinfo']),
	exec(`pnpm tsc`),
	timeEnd(),
	log('\nTS compiled in', time(), 'ms\n'),
);
else snake(
	timeStart(),
	async () => Object.keys(require('./dist')).forEach(e => e != 'default' && mn.push(e)),
	exec('pnpm webpack'),
	mkdir('temp'),
	outFS([
		[1, cmt('lib/index.ts')],
		[1, '((exp)=>{'],
		[0, 'dist/packed.js'],
		[1, '})(typeof module==="undefined"?false:module);']
	], 'temp/index.js'),
	timeEnd(),
	log('\nwebpack compiled in', time(), 'ms\n'),
	dels([
		RegExp(`^${goodReg(comp('dist'))}.*(js|js.map)$`),
		'dist/exp.d.ts',
	]),
	mvs(['temp', 'dist']),
	() => Promise.thens(mn.map(m =>
		() => fsp.writeFile(`dist/${m}.js`, `module.exports=require('.').${m};`)
	)),
	timeEnd(),
	log('\nBuilt in', time(), 'ms\n')
).then(() => process.exit(0));
