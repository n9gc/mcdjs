require('../build');
const { default: run, out, RunInfos } = require('../build/cli/hfile');

(async () => {
	const info = new RunInfos([__dirname + '/tests/say.ts'], __dirname + '/out.json');
	const parsed = await run(info);
	await out(info, parsed);
	process.exit(0);
})();
