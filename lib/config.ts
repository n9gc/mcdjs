/**
 * 配置相关
 * @module mcdjs/lib/config
 * @version 2.1.0
 * @license GPL-3.0-or-later
 */
declare module './config';

export const env = {
	version: '0.9.2',
} as const;

export namespace Types {
	export enum CbType {
		Impulse = 0,
		ImpulseCon = 1,
		Chain = 2,
		ChainCon = 3,
		Repeat = 4,
		RepeatCon = 5,
	}
	export interface Command {
		type: CbType;
		code: string;
		timeout?: number;
		note?: string;
	}
	export type Commands = Command[];
	export interface FileParsed {
		[group: string]: Commands;
	}
	export interface RoundParsed {
		[file: string]: FileParsed;
	}
	export type Mods = 'cli' | 'command' | 'config' | 'hfile' | 'parser';
}
