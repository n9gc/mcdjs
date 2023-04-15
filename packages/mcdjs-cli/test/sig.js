const { default: run, out, RunInfos } = require('../dist/hfile');

(async () => {
	const info = new RunInfos([__dirname + '/tests/say.js'], __dirname + '/out.json');
	const parsed = await run(info);
	await out(info, parsed);
	process.exit(0);
})();
