/// <reference types="node" />
import * as fsp from 'fs/promises';

export default async function <T>(n: T) {
	await fsp.writeFile(
		__dirname + '/out.json',
		JSON.stringify(n, null, '  ')
	);
}
