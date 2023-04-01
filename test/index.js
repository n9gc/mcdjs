#!/usr/bin/env node

require('../build/alload');
const { default: run, out } = require('../build/cli/hfile');
const fsp = require('fs/promises');

(async () => {
	const tests = await fsp.readdir(__dirname + '/tests');
	const parsed = await run({ inputs: tests.map(n => `${__dirname}/tests/${n}`) });
	await out({ outfile: __dirname + '/out.json' }, parsed);
	process.exit(0);
})();
