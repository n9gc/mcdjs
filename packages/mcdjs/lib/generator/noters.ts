/**
 * 注释函数
 * @module mcdjs/lib/generator/noters
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './noters';

import { GenerateOption } from ".";
import { CbType } from "../types/game";
import { InferedString } from "../types/tool";
import { formatMPText } from "./formatters";
import * as noters from './noters';

export type InternalNoter = InferedString<keyof typeof noters, 'note'>;
export interface Noter {
	(note: string): string | PromiseLike<string>;
}

export default function getNoter({ noter, formatter }: GenerateOption) {
	if (typeof noter === 'function') return noter;
	if (typeof formatter === 'function') return noteMPText;
	return noters[`note${noter ?? formatter ?? 'MPText'}`];
}

export function noteLog(note: string) {
	return formatMPText({
		note: 'Info',
		cbType: CbType.Impulse,
		command: `say ${note}`,
		delay: 0,
		conditional: false,
		redstone: null,
	});
}

export function noteMPText(note: string) {
	return `# ${note}\n`;
}
