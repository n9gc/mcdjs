/**
 * 命令格式化函数
 * @module mcdjs/lib/generator/formatters
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './formatters';

import { GenerateOption } from ".";
import { CbInfo, CbType } from "../types/game";
import { InferedString } from "../types/tool";
import * as formatters from './formatters';

export type InternalFormatter = InferedString<keyof typeof formatters, 'format'>;
export interface Formatter {
	(cbInfo: CbInfo): string | PromiseLike<string>;
}

export default function getFormatter({ formatter }: GenerateOption) {
	return typeof formatter === 'function' ? formatter : formatters[`format${formatter ?? 'MPText'}`];
}

export function formatMPText({
	note,
	cbType,
	command,
	delay,
	conditional,
	redstone,
}: CbInfo) {
	return [
		`[${[
			formatMPText.getRedstone(redstone),
			formatMPText.getCbType(cbType),
			formatMPText.getConditional(conditional),
			formatMPText.getDelay(delay),
		]}]`,
		command,
		note && `// ${note}`,
	].filter(n => n).join(' ') + '\n';
}
export namespace formatMPText {
	export function getRedstone(redstone: boolean | null) {
		return redstone === null ? '~' : redstone ? '-' : '+';
	}
	export function getCbType(cbType: CbType | null) {
		switch (cbType) {
			case CbType.Chain: return 'L';
			case CbType.Impulse: return 'M';
			case CbType.Repeat: return 'X';
			default: return '~';
		}
	}
	export function getConditional(conditional: boolean | null) {
		return conditional === null ? '~' : conditional ? '+' : '-';
	}
	export function getDelay(delay: number | null) {
		return delay ?? '~';
	}
}
