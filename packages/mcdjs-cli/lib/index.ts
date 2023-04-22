/**
 * 命令行工具模块
 * @module mcdjs-cli
 * @version 1.0.5
 * @license GPL-3.0-or-later
 */
declare module '.';
export const version = '1.0.5';

import 'mcdjs';
import run, { out, RunInfos } from './hfile';

export async function getVersion() {
	return {
		base: (await import('@mcdjs/base')).version,
		core: (await import('mcdjs')).version,
		cli: version,
	};
}

export default async function handle() {
	const input = process.argv.at(-2);
	const outfile = process.argv.at(-1);
	if (process.argv.length < 3) {
		return console.log(`Version ${await getVersion()}`);
	}
	const infos = new RunInfos([input!], outfile);
	await out(infos, await run(infos));
	process.exit(0);
}
