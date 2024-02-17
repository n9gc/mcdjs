/**
 * 自动化构建脚本
 * @license GPL-2.0-or-later
 */

import * as fs from 'fs';
import fse from 'fs-extra';
import * as fsp from 'fs/promises';
import { JSDOM } from 'jsdom';
import Initer from 'lethal-build';
import needle from 'needle';
import * as path from 'path';
import 'promise-snake';
import stream from 'stream';

export const {
	comp,
	dir,
} = Initer(__dirname + '/../..');

const debug = process.argv[2] === '--debug'

export async function pipeStream(from: NodeJS.ReadableStream, to: NodeJS.WritableStream) {
	await new Promise(res => from.pipe(to).once('close', res));
}
export async function readStream(stream: NodeJS.ReadableStream | null) {
	if (!stream) return '';
	const buffers: any[] = [];
	stream.on('data', data => buffers.push(data));
	await new Promise(res => stream.once('close', res));
	return buffers.join('');
}

export function outFilename(file: string) {
	return path.relative(dir, file);
}

export async function curl(url: string): Promise<NodeJS.ReadableStream> {
	const rep = await needle('get', url, { protocol: 'https:' });
	if (rep.errored) throw new Error(`Failed to fetch ${url}`);
	console.log(`Fetched ${url}`);
	return stream.Readable.from(rep.body);
}
export async function writeFile(stream: NodeJS.ReadableStream | null, file: string) {
	if (!stream) throw new Error(`Failed to write ${outFilename(file)}`);
	await fse.ensureFile(file);
	await pipeStream(stream, fs.createWriteStream(file));
	console.log(`Wrote ${outFilename(file)}`);
}
export interface DownloadCfg {
	force?: boolean;
	tryGet?: boolean;
}
export async function download(url: string, file: string, { force = false, tryGet = false }: DownloadCfg = {}) {
	if (!force && await fse.exists(file)) return console.log(`Already find ${outFilename(file)}`);
	try {
		await writeFile(await curl(url), file);
	}
	catch (err) {
		if (!tryGet) throw err;
	}
}
export async function cacheLink(node: HTMLScriptElement | HTMLLinkElement) {
	const url = 'src' in node ? node.src : node.href;
	if (!url.includes('//') || 'nolinkcache' in node.dataset) return;
	const noPtc = url.slice(url.indexOf('//') + 1);
	const file = comp('docs/local' + noPtc);
	download(url, file);
	download(`${url}.map`, `${file}.map`, { tryGet: true });
	const lk = './local' + noPtc;
	'src' in node ? node.src = lk : node.href = lk;
}
export async function readHtml() {
	console.log('Reading HTML...');
	const html = await fsp.readFile(comp('docs/index.html'));
	const dom = new JSDOM(html);
	const { window: { document } } = dom;
	const sclist: Promise<any>[] = [];
	document.querySelectorAll('script').forEach(node => sclist.push(cacheLink(node)));
	document.querySelectorAll('link').forEach(node => sclist.push(cacheLink(node)));
	await Promise.all(sclist);
	if (!debug) await fsp.writeFile(comp('docs/index.html'), dom.serialize());
}
export default async function snake() {
	await readHtml();
}

snake();
