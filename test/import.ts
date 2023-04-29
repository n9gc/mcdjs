// import { compilerOptions as tsc } from '../tsconfig.json';
/// <reference types="../packages/mcdjs-cli/node_modules/@types/node" />
import tester = require('export-tester');
import * as path from 'path';

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

export default async function (
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
