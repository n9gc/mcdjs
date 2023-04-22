/**
 * 命令行工具模块
 * @module mcdjs-cli
 * @version 1.0.5
 * @license GPL-3.0-or-later
 */
declare module '.';

import { versions as mcdjsBaseVer } from '@mcdjs/base';
import { versions as mcdjsVer } from 'mcdjs';
export const versions = {
	'mcdjs-cli': '1.0.5',
	...mcdjsBaseVer,
	...mcdjsVer,
} as const;

import run, { out, RunInfos } from './hfile';

export default async function handle() {
	const input = process.argv.at(-2);
	const outfile = process.argv.at(-1);
	if (process.argv.length < 3) {
		return console.log(`Version Info: ${JSON.stringify(versions, null, '  ')}`);
	}
	const infos = new RunInfos([input!], outfile);
	await out(infos, await run(infos));
	process.exit(0);
}
