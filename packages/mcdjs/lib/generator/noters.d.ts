/**
 * 注释函数
 * @module mcdjs/lib/generator/noters
 * @version 1.0.1
 * @license GPL-2.0-or-later
 */
declare module './noters';
import type { GenerateOption } from ".";
import type { InferedString } from "../types/tool";
import * as noters from './noters';
export type InternalNoter = InferedString<keyof typeof noters, 'note'>;
export interface Noter {
    (note: string): string | PromiseLike<string>;
}
export default function getNoter({ noter, formatter }: GenerateOption): noters.Noter;
export declare function noteLog(note: string): string;
export declare function noteMPText(note: string): string;
