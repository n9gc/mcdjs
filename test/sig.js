require('../build');
const { default: run, out } = require('../build/cli/hfile');

(async () => {
	const parsed = await run({ inputs: [__dirname + '/tests/say.ts'] });
	await out({ outfile: __dirname + '/out.json' }, parsed);
	process.exit(0);
})();
