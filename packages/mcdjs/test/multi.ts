/// <reference types="node" />
import * as fsp from 'fs/promises';
import { extname } from 'path';
import { parse } from '../lib/appinf';
import out from './print';

export default async function () {
	console.log('*multi* started!');
	const tests = (await fsp.readdir(__dirname + '/tests')).filter(n => extname(n) === '.ts');
	await out(
		await Promise.all(
			tests
				.map(n => `${__dirname}/tests/${n}`)
				.map(n => parse(n, () => import(n), { globalify: true }))
		)
	);
}
