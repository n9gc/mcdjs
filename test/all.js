require('../packages/mcdjs-cli/node_modules/promise-snake');
const { spawn, fork, ChildProcess } = require('child_process');

/**@type {((dir:string,n:string)=>ChildProcess)[]} */
const methods = [
	(dir, n) => fork(`${dir}/${n}.js`, {
		stdio: 'overlapped'
	}),
];
const method = methods[0];

module.exports = (
	/**@type {string} */
	dir,
	/**@type {string[]} */
	fileList,
) => Promise.snake(fileList.map(n =>
	(res, rej) => method(dir, n)
		.on('message', i => console.log(`From ${n}:`, i))
		.on('close', i => i ? rej(n) : res())
)).then(
	() => {
		console.log('Success!');
		process.exit(0);
	},
	n => {
		console.log(`Err at ${n}`);
		process.exit(1);
	},
);
