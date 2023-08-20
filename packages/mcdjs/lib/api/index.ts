/**
 * 程序结构工具模块
 * @module mcdjs/lib/api
 * @version 3.0.0
 * @license GPL-2.0-or-later
 */
declare module '.';

import type { Operator } from '../magast';
import clsGrammer from './grammer';

export interface Api extends clsGrammer { }
export default function getApi(opering: Operator): Api {
	return new clsGrammer(opering);
}
