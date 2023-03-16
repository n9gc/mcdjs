/**
 * 配置相关
 * @module mcdjs/lib/config
 * @version 2.0.0
 * @license GPL-3.0-or-later
 */
declare module './config';

export const env = {
	version: '0.9.2',
} as const;

export namespace Types {
	export type Commands = Command[];
	export interface Command extends String {
	}
	export type Mods = 'cli' | 'command' | 'config' | 'hfile' | 'parser';
}
