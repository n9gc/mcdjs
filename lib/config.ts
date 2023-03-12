/**
 * 配置相关
 * @module mcdjs/lib/config
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
declare module './config';

export const env = {
	version: '0.9.0',
} as const;

export namespace Types {
	export type Command = string[];
	export type Mods = 'cli' | 'command' | 'config' | 'hfile' | 'parser';
}
