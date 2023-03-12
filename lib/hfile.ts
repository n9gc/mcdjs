/**
 * 文件解析处理模块
 * @module mcdjs/lib/hfile
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './hfile';

import type { Types } from './config';
import 'promise-snake';
import Parser from './parser';
import * as path from 'path';
import * as fs from 'fs';
import * as fsp from 'fs/promises';

export interface ParRunInfos extends Partial<RunInfos> { }
export class RunInfos {
	constructor({ inputs = [], outfile = '' }: ParRunInfos = {}) {
		this.inputs = inputs;
		this.outfile = outfile;
	}
	inputs: string[];
	outfile: string;
}
export const resolveList = [
	'',
	'.mcdjs',
	'.js',
	'.txt',
	'.mjs',
	'.cjs',
];
export async function resolve({ inputs }: RunInfos) {
	const files: string[] = [];
	await Promise.snake(inputs
		.map(input => path.resolve(input))
		.map(file => path.extname(file) ? file : resolveList.map(ext => file + ext))
		.map(file => (res, rej) => typeof file === 'string'
			? fsp.access(file, fs.constants.F_OK).then(() => (files.push(file), res()), rej)
			: Promise.snake(file.map(may => (res, rej) =>
				fsp.access(may, fs.constants.F_OK).then(() => rej(may), res)
			)).then(() => fsp.access(file[0], fs.constants.F_OK), (sure) => (files.push(sure), res()))
		)
	);
	return files;
}
export interface Commands {
	[file: string]: Types.Command;
}
export async function compile(files: string[]) {
	const commands: Commands = {};
	await Promise.snake(files.map(file => async res => {
		const parser = new Parser(file);
		await import(file);
		commands[file] = parser.command;
		return res();
	}));
	return commands;
}
export async function out(infos: RunInfos, commands: Commands) {
	await fsp.writeFile(path.resolve(infos.outfile), JSON.stringify(commands));
}
export default async function run(infos: RunInfos) {
	const files = await resolve(infos);
	const commands = await compile(files);
	return commands;
}
