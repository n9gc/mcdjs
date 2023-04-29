import { default as run, out, RunInfos } from '../lib/hfile';

export default async function () {
	const info = new RunInfos([__dirname + '/tests/say.js'], __dirname + '/out.json');
	const parsed = await run(info);
	await out(info, parsed);
}
