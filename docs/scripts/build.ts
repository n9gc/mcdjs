/**
 * 自动化构建脚本
 * @license GPL-2.0-or-later
 */

import * as fs from 'fs';
import * as fsp from 'fs/promises';
import Initer from 'lethal-build';
import fetch from 'node-fetch';
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
	async outPuml() {
		const pumlList = await this.lb.match(/.*\.puml$/);
		await Promise.all(pumlList.map(async puml => {
			if (await this.isExist(`${puml}.svg`)) return;
			const text = await fsp.readFile(puml);
			const url = `https://www.gravizo.com/svg?${encodeURIComponent(`${text}`)}`;
			const svgRes = await fetch(url);
			if (!svgRes.ok) throw new Error(`Failed to get SVG of ${puml}`, { cause: await this.waitStream(svgRes.body) });
			await new Promise(res => svgRes.body?.pipe(fs.createWriteStream(`${puml}.svg`)).once('close', res));
		}));
	}
	async snake() {
		await this.outPuml();
	}
}

new Handler().snake();
