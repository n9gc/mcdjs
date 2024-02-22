/**
 * 命令格式化函数
 * @module mcdjs/lib/generator/formatters
 * @version 1.0.1
 * @license GPL-2.0-or-later
 */
declare module './formatters';
import type { GenerateOption } from ".";
import { CbInfo, CbType } from "../types/game";
import type { InferedString } from "../types/tool";
import * as formatters from './formatters';
export type InternalFormatter = InferedString<keyof typeof formatters, 'format'>;
export interface Formatter {
    (cbInfo: CbInfo): string | PromiseLike<string>;
}
export default function getFormatter({ formatter }: GenerateOption): formatters.Formatter;
export declare function formatMPText({ note, cbType, command, delay, conditional, redstone, }: CbInfo): string;
export declare namespace formatMPText {
    function getRedstone(redstone: boolean | null): "~" | "-" | "+";
    function getCbType(cbType: CbType | null): "~" | "L" | "M" | "X";
    function getConditional(conditional: boolean | null): "~" | "-" | "+";
    function getDelay(delay: number | null): number | "~";
}
