/**
 * 转译流程模块
 * @module mcdjs/lib/plugin
 * @version 1.1.0
 * @license GPL-2.0-or-later
 */
declare module '.';
import Organizer from "aocudeo/async";
import type { Operator } from "../magast";
export declare const organizer: Organizer<Operator>;
export default function (operm: Operator): Promise<Operator>;
