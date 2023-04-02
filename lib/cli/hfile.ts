/**
 * 文件解析处理模块
 * @module mcdjs/lib/cli/hfile
 * @version 1.0.4
 * @license GPL-3.0-or-later
 */
declare module './hfile';

import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import 'promise-snake';
import { Types } from '../alload';
import { parse } from "../appinf";
import { errCatcher, EType, trapErr } from '../errlib';

export interface ParRunInfos extends Partial<RunInfos> { }
export class RunInfos {
	constructor(
		public inputs: string[] = [],
		public outfile: string = '',
	) { }
}
export const assocList = [
	'',
	'.mcdjs',
	'.js',
	'.txt',
	'.mjs',
	'.cjs',
	'.ts',
	'.tsx',
	'.jsx',
];
function isExist(file: string) {
	return new Promise<boolean>(res => fs.access(file, fs.constants.F_OK, err => res(!err)));
}
export async function resolve({ inputs }: RunInfos) {
	const files: string[] = [];
	await Promise.snake(inputs
		.map(input => path.resolve(input))
		.map(file => path.extname(file) ? file : assocList.map(ext => file + ext))
		.map(file => (res, rej) => typeof file === 'string'
			? isExist(file).then(n => n ? (files.push(file), res()) : trapErr(rej, EType.ErrNoSuchFile, Error(), [file])())
			: Promise.snake(file.map(may => (res, rej) =>
				isExist(may).then(n => n ? rej(may) : res())
			)).then(trapErr(rej, EType.ErrNoSuchFile, Error(), file), (sure) => (files.push(sure), res()))
		)
	).catch(errCatcher);
	return files;
}
export async function compile(files: string[]) {
	const commands: Types.RoundParsed = [];
	await Promise.thens(files.map(file => async () =>
		commands.push(await parse(file, () => import(file)))
	));
	return commands;
}
export async function out(infos: RunInfos, commands: Types.RoundParsed) {
	await fsp.writeFile(path.resolve(infos.outfile), JSON.stringify(commands, null, '  '));
}
export default async function run(infos: RunInfos) {
	const files = await resolve(infos);
	const commands = await compile(files);
	return commands;
}
