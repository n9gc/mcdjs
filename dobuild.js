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

const mn = [
	'config',
	'err',
	'parser',
	'entry',
	'glodef',
	'mcdtemp',
];
// match().then(e => console.log(e));
snake(
	dels('build'),
	exec('npm exec tsc'),
	exec('npm exec webpack'),
	mkdir('temp'),
	outFS([
		[1, cmt('lib/index.ts')],
		[1, '((exp,McdTemp)=>{'],
		[0, 'build/packed.js'],
		[1, '})(typeof module==="undefined"?false:module,{});']
	], 'temp/index.js'),
	mvs([
		['build/cli', 'temp/cli'],
	]),
	dels([
		RegExp(`^${goodReg(comp('build'))}.*js$`),
		'build/exp.d.ts',
	]),
	mvs(['temp', 'build']),
	...mn.map(m => outFS([[1, `module.exports=require('.').${m}`]], `build/${m}.js`)),
	log('OK.')
);
