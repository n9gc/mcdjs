/**
 * 测试导入
 * @module @mcdjs/dev/tester/import
 * @version 1.2.1
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
	"skipLibCheck": true,
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
	file: string | string[],
	cfg: Parameters<typeof tester>[0]['cfg'] = {},
	opt: Parameters<typeof tester>[0] = {},
) {
	const { err, detail } = await tester(
		{
			disp: false,
			file: path.join(dirNow, ...(typeof file === 'string' ? [file] : file)),
			sign: 'cmd',
			cfg: { ...cfg, ts: { cmd, ...cfg?.ts } },
			...opt,
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
