/**
 * 类型定义
 * @version 1.0.0
 * @license GPL-3.0-or-later
 */
void 0;

namespace McdJSTemp {
	globalThis.McdJSTempMerge(McdJSTemp);
	export namespace Struct {
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
			export interface RoundParsed {
				[file: string]: import('../opnast').AST;
			}
			export type Mods =
				| Exclude<keyof typeof import('..'), 'default'>
				| 'exp'
				| 'cli'
				| 'index';
		}
	}
}
