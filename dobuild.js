const { snake, exec, getCmt, dels, setCmt, outFS, log } = require('lethal-build')(__dirname);

// match(/types[\/\\].*js$/).then(e => console.log(e));

snake(
	exec('tsc'),
	exec('webpack'),
	setCmt('lib/index.ts'),
	outFS([
		[1, getCmt()],
		[1, '!function(exp){'],
		[0, 'types/packed.js'],
		[1, '}(typeof module==="undefined"?false:module)']
	], 'index.js'),
	dels(/types[\/\\].*js$/),
	log('OK.')
);
