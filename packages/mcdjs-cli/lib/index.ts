/**
 * 命令行工具模块
 * @module mcdjs-cli
 * @version 1.0.7
 * @license GPL-3.0-or-later
 */
declare module '.';

import run, { out, RunInfos } from './hfile';
import * as path from 'path';

export function getVersion(){
	const pinfo = path.join(require.resolve('mcdjs'), '../../package.json');
	return require(pinfo).version as string;
}

export default async function handle() {
	const input = process.argv.at(-2);
	const outfile = process.argv.at(-1);
	if (process.argv.length < 3) {
		return console.log(`Version Info: ${getVersion()}`);
	}
	const infos = new RunInfos([input!], outfile);
	await out(infos, await run(infos));
	process.exit(0);
}
