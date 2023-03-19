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
	comp,
	goodReg,
} = require('lethal-build')(__dirname);
const fsp = require('fs/promises');
require('promise-snake');

const mn = [];
const mv = [
	'cli',
];
snake(
	dels('build'),
	exec('npm exec tsc'),
	async () => Object.keys(require('./build')).forEach(e => e != 'default' && mn.push(e)),
	exec('npm exec webpack'),
	mkdir('temp'),
	outFS([
		[1, cmt('lib/index.ts')],
		[1, '((exp)=>{'],
		[0, 'build/packed.js'],
		[1, '})(typeof module==="undefined"?false:module);']
	], 'temp/index.js'),
	mvs(mv.map(e => [`build/${e}`, `temp/${e}`])),
	dels([
		RegExp(`^${goodReg(comp('build'))}.*js$`),
		'build/exp.d.ts',
	]),
	mvs(['temp', 'build']),
	() => Promise.thens(mn.map(m =>
		fsp.writeFile(`build/${m}.js`, `module.exports=require('.').${m};`)
	)),
	log('OK.')
);
