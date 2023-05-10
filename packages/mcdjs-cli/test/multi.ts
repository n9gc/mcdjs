/// <reference types="node" />
import { default as run, out, RunInfos } from '../lib/hfile';
import * as fsp from 'fs/promises';

export default async function () {
	console.log('*multi* started!');
	const tests = await fsp.readdir(__dirname + '/tests');
	const info = new RunInfos(tests.map(n => `${__dirname}/tests/${n}`), __dirname + '/out.json');
	const parsed = await run(info);
	await out(info, parsed);
}
