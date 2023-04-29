import { default as run, out, RunInfos } from '../lib/hfile';
import fsp from 'fs/promises';

export default async function () {
	const tests = await fsp.readdir(__dirname + '/tests');
	const info = new RunInfos(tests.map(n => `${__dirname}/tests/${n}`), __dirname + '/out.json');
	const parsed = await run(info);
	await out(info, parsed);
}
