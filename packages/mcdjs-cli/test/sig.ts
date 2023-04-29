import { default as run, out, RunInfos } from '../lib/hfile';

export default async function () {
	console.log('*sig* started!');
	const info = new RunInfos([__dirname + '/tests/say'], __dirname + '/out.json');
	const parsed = await run(info);
	await out(info, parsed);
}
