require('promise-snake');
const { spawn, fork } = require('child_process');

const fileList = [
	'import',
];
module.exports = (/**@type {string} */dir) =>
	Promise.snake(fileList.map(n =>
		// (res, rej) => spawn('node', [`${__dirname}/${n}.js`]).on('close', i => i ? rej(n) : res())
		(res, rej) => fork(`${dir}/${n}.js`).on('close', i => i ? rej(n) : res())
	)).then(
		() => process.exit(0),
		n => (console.log(n), process.exit(1))
	);
