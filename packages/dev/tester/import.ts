/**
 * 测试导入
 * @module @mcdjs/dev/tester/import
 * @version 1.2.0
 * @license GPL-3.0-or-later
 */
declare module './import';

import tester = require('export-tester');
import * as path from 'path';
import checkrun from '../tool/checkrun';

const dirNow = path.resolve();

const tsc = {
	"module": "CommonJS",
	"moduleResolution": "Node",
	"target": "ESNext",
} as const;
const skipKey = [
	'noImplicitAny',
	'strict',
];
const cmd = ['', ...Object.keys(tsc)].reduce((p, k) =>
	//@ts-ignore
	skipKey.includes(k) ? p : `${p} --${k} ${tsc[k] === true ? '' : tsc[k]}`
);

export default async function def(
	cfg: Parameters<typeof tester>[0]['cfg'],
	...dirs: string[]
) {
	const { err, detail } = await tester(
		{
			file: path.join(dirNow, ...dirs),
			sign: 'cmd',
			cfg: { ...cfg, ts: { cmd, ...cfg?.ts } },
		},
		{
			import() {
				console.log(cmd);
			}
		}
	);
	err && process.send?.(detail);
	process.exit(err);
}

checkrun(def);
