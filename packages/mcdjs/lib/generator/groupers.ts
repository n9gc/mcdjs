/**
 * 分组函数
 * @module mcdjs/lib/generator/groupers
 * @version 1.0.1
 * @license GPL-2.0-or-later
 */
declare module './groupers';

import type { GenerateOption } from '.';
import type { InferedString } from '../types/tool';
import * as groupers from './groupers';

export type InternalGrouper = InferedString<keyof typeof groupers, 'note'>;
export interface Grouper {
	(): string | PromiseLike<string>;
}

export default function getGrouper({ grouper, formatter }: GenerateOption) {
	if (typeof grouper === 'function') return grouper;
	if (typeof formatter === 'function') return groupMPText;
	return groupers[`group${grouper ?? formatter ?? 'MPText'}`];
}

export function groupMPText() {
	return '\n';
}
