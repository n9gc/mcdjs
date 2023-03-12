const { snake, exec, cmt, dels, outFS, log, cps } = require('lethal-build')(__dirname);

const mv = [
	'hfile',
	'cli',
];
const mn = [
	'command',
	'config',
	'parser',
];
snake(
	exec('tsc'),
	exec('webpack'),
	outFS([
		[1, cmt('lib/index.ts')],
		[1, '!function(exp){'],
		[0, 'build/packed.js'],
		[1, '}(typeof module==="undefined"?false:module)']
	], 'lib/index.js'),
	cps(mv.map(m => [`build/${m}.js`, `lib/${m}.js`])),
	dels(/build[\/\\].*js$/),
	dels(['exp'].map(m => `build/${m}.d.ts`)),
	cps([...mv, 'index'].map(m => [`lib/${m}.js`, `build/${m}.js`])),
	dels([...mv, 'index'].map(m => `lib/${m}.js`)),
	...mn.map(m => outFS([[1, `module.exports=require('.').${m}`]], `build/${m}.js`)),
	log('OK.')
);
