/**
 * 批量测试
 * @module @mcdjs/dev/tester/all
 * @version 1.2.0
 * @license GPL-3.0-or-later
 */
declare module './all';

import { ChildProcess, fork } from 'child_process';
import { resolve } from 'path';
import 'promise-snake';
import checkrun from '../tool/checkrun';

const dirNow = resolve();
const methods: ((dir: string, n: string) => ChildProcess)[] = [
	(dir, n) => fork(`${dir}/${n}.js`, {
		stdio: 'overlapped'
	}),
];
const method = methods[0];

export default function def(fileList: string[]) {
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

checkrun(def);
