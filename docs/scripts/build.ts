/**
 * 自动化构建脚本
 * @license GPL-2.0-or-later
 */

import * as fs from 'fs';
import Initer from 'lethal-build';
import 'promise-snake';

class Handler {
	protected lb = Initer(import.meta.url + '/../..');
	protected async isExist(fileName: string) {
		return !await new Promise(res => fs.access(fileName, fs.constants.F_OK, res));
	}
	protected async waitStream(stream: NodeJS.ReadableStream | null) {
		if (!stream) return '';
		const buffers: any[] = [];
		stream.on('data', data => buffers.push(data));
		await new Promise(res => stream.once('end', res));
		return buffers.join('');
	}
	async snake() {
	}
}

new Handler().snake();
