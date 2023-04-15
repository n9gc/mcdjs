const tsc = require('../tsconfig.json').compilerOptions;
const tester = require('export-tester');
const path = require('path');
const skipKey = [
	'noImplicitAny',
	'strict',
];
const cmd = ['', ...Object.keys(tsc)].reduce((p, k) =>
	//@ts-ignore
	skipKey.includes(k) ? p : `${p} --${k} ${tsc[k] === true ? '' : tsc[k]}`
);
module.exports = (
	/**@type {Parameters<typeof tester>[0]['cfg']} */
	cfg,
	/**@type {string[]} */
	...dirs
) => tester(
	{
		file: path.join(...dirs),
		sign: 'cmd',
		cfg: { ...cfg, ts: { cmd, ...cfg?.ts } },
	},
	{
		import() {
			console.log(cmd);
		}
	}
).then(
	({ err }) => process.exit(err),
);
