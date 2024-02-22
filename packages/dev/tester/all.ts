/**
 * 批量测试
 * @version 1.4.1
 * @license GPL-2.0-or-later
 */
declare module './all';

import { resolve } from 'path';
import 'promise-snake';
import checkrun from '../tool/checkrun';

export interface Option {
	ignoreError?: boolean;
}
export default function def(fileList: string[], { ignoreError = false }: Option = {}) {
	return fileList.forEachAsync(async file => {
		try {
			await (await import(resolve(file))).default?.();
		} catch (err) {
			if (ignoreError) console.error(err);
			else throw err;
		}
	});
}

checkrun(def);
