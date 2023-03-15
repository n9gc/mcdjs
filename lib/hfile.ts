/**
 * 文件解析处理模块
 * @module mcdjs/lib/hfile
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './hfile';

import { Types, errCatcher, ErrType, ErrNoSuchFile } from './config';
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
function isExist(file: string) {
	return new Promise<boolean>(res => fs.access(file, fs.constants.F_OK, err => res(!err)));
}
function trapFileErr(rej: (err: ErrNoSuchFile) => void, files: string[], tracker: Error) {
	return () => rej({ type: ErrType.NoSuchFile, files, tracker });
}
export async function resolve({ inputs }: RunInfos) {
	const files: string[] = [];
	await Promise.snake(inputs
		.map(input => path.resolve(input))
		.map(file => path.extname(file) ? file : resolveList.map(ext => file + ext))
		.map(file => (res, rej) => typeof file === 'string'
			? isExist(file).then(n => n ? (files.push(file), res()) : trapFileErr(rej, [file], Error())())
			: Promise.snake(file.map(may => (res, rej) =>
				isExist(may).then(n => n ? rej(may) : res())
			)).then(trapFileErr(rej, file, Error()), (sure) => (files.push(sure), res()))
		)
	).catch(errCatcher);
	return files;
}
export interface Commands {
	[file: string]: Types.Command;
}
export async function compile(files: string[]) {
	const commands: Commands = {};
	await Promise.thens(files.map(file => async () => {
		const parser = new Parser(file);
		await import(file);
		commands[file] = parser.command;
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
