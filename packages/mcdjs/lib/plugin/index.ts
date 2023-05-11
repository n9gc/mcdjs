/**
 * 转译流程模块
 * @module mcdjs/lib/plugin
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module '.';

import Origanizer from "aocudeo/async";
import { Operator } from "../magast";

export const origanizer = new Origanizer<Operator>;
export default function (operm: Operator) {
	return origanizer.create(operm).load();
}

export * from './internal-cmd2cb';
