/**
 * 命令行工具模块
 * @module mcdjs/lib/cli
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
declare module './cli';

import run, { out, RunInfos } from './hfile';
import { env } from './config';

export default async function handle() {
	const input = process.argv.at(-2);
	const outfile = process.argv.at(-1);
	if (process.argv.length < 3) return console.log(`Version ${env.version}`);
	const infos = new RunInfos({ inputs: [input!], outfile });
	await out(infos, await run(infos));
}
