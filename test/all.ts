import '../packages/mcdjs-cli/node_modules/promise-snake';
import { spawn, fork, ChildProcess } from 'child_process';
import { resolve } from 'path';

const dirNow = resolve();
const methods: ((dir: string, n: string) => ChildProcess)[] = [
	(dir, n) => fork(`${dir}/${n}.js`, {
		stdio: 'overlapped'
	}),
];
const method = methods[0];

export default function (fileList: string[]) {
	return Promise.snake(fileList.map(n =>
		(res, rej) => method(dirNow, n)
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
}
