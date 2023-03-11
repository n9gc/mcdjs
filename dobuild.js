const { snake, exec, match, dels, cps, outFS, log } = require('lethal-build')(__dirname);

// match(/types[\/\\].*js$/).then(e => console.log(e));

snake(
	exec('tsc'),
	exec('webpack'),
	outFS([
		[1, '!function(exp){'],
		[0, 'types/packed.js'],
		[1, '}(typeof module==="undefined"?false:module)']
	], 'index.js'),
	dels(/types[\/\\].*js$/),
	log('OK.')
);
