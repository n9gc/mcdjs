const { default: run, out, RunInfos } = require('../dist/hfile');
const fsp = require('fs/promises');

(async () => {
	const tests = await fsp.readdir(__dirname + '/tests');
	const info = new RunInfos(tests.map(n => `${__dirname}/tests/${n}`), __dirname + '/out.json');
	const parsed = await run(info);
	await out(info, parsed);
	process.exit(0);
})();
