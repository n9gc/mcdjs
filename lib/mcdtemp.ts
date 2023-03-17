/**
 * 全局临时对象定义模块
 * @module mcdjs/lib/mcdtemp
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './mcdtemp';

import * as Imp from '.';
import { callback } from 'you-can-too';

const voidFn = callback.giveAndReturn as () => void;
export const packed = typeof McdTemp !== 'undefined';
let copy: PropertyDescriptor | undefined;
export let tAdd = packed
	? () => {
		McdTemp.Imp = Imp;
		tAdd = voidFn;
	}
	: () => {
		copy = Object.getOwnPropertyDescriptor(globalThis, 'McdTemp');
		globalThis.McdTemp = { Imp } as typeof McdTemp;
	};
export const tDel = packed
	? voidFn
	: () => copy
		? Object.defineProperty(globalThis, 'McdTemp', copy)
		: (globalThis.McdTemp as unknown) = void 0;
