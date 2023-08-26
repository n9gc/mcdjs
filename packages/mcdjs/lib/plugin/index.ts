/**
 * 转译流程模块
 * @module mcdjs/lib/plugin
 * @version 1.0.5
 * @license GPL-2.0-or-later
 */
declare module '.';

import Organizer from "aocudeo/async";
import type { Operator } from "../magast";

export const organizer = new Organizer<Operator>();
export default async function (operm: Operator) {
	await organizer.execute(operm);
	return operm;
}

export * from './internal-pack';
export * from './internal-cond';
