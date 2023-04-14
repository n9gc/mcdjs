const path = require('path');
const root = path.join(__dirname, '../');
const file = path.join(root, 'build/index.js');
const tsc = require('../tsconfig.json').compilerOptions;
/**@type {(keyof typeof tsc)[]} */
const skipKey = [
	'outDir',
	'noImplicitAny',
	'strict',
];
const cmd = ['', ...Object.keys(tsc)].reduce((p, k) =>
	skipKey.includes(k) ? p : `${p} --${k} ${tsc[k] === true ? '' : tsc[k]}`
);
require('export-tester')(
	{
		file,
		sign: 'McdJS',
		cfg: { ts: { cmd } },
	},
	{
		import() {
			console.log(McdJS);
		}
	}
).then(
	({ err }) => process.exit(err),
);
