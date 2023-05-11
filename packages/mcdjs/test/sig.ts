/// <reference types="node" />
import { parse } from '../lib/appinf';
import out from './print';

export default async function () {
	console.log('*sig* started!');
	const say = __dirname + '/tests/say.ts';
	await out(await parse(say, () => import(say)));
}
