/**
 * 转译流程模块
 * @module mcdjs/lib/plugin
 * @version 1.0.3
 * @license GPL-2.0-or-later
 */
declare module '.';

import Organizer from "aocudeo/async";
import { Operator } from "../magast";

export const organizer = new Organizer<Operator>();
export default function (operm: Operator) {
	return organizer.execute(operm);
}

export * from './internal-pack';
export * from './internal-cond';
