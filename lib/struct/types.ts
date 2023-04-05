/**
 * 类型定义
 * @version 1.1.3
 * @license GPL-3.0-or-later
 */
(McdJSTemp as any) = globalThis.McdJSTempGet();

namespace McdJSTemp {
	export namespace Struct {
		export namespace Types {
			export type AnyArr<T = any> = readonly T[];
			export type WideNum = number | bigint;
			export type MayNum = WideNum | string;
			export type Tostrable = boolean | MayNum | null | undefined;
			export type EqualTo<A, B> = (<F>() => F extends A ? 1 : 0) extends (<F>() => F extends B ? 1 : 0) ? true : false;
			export type InterOfUnion<N> = (N extends N ? (n: N) => 0 : 0) extends (n: infer K) => 0 ? K : never;
			type OneOfUnion<N> = InterOfUnion<N extends N ? () => N : 0> extends () => infer K ? K : N;
			export type EachOfUnion<
				N,
				R extends any[] = []>
				= ([N] extends [never]
					? R
					: (OneOfUnion<N> extends infer K
						? EachOfUnion<Exclude<N, K>, [...R, K]>
						: []
					)
				);
			export type UniqueItems<
				L extends any[],
				R extends any[] = []>
				= (L extends [infer S, ...infer K]
					? [S, ...UniqueItems<[...R, ...K]>] | UniqueItems<K, [S, ...R]>
					: []
				);
			export type Joined<
				S extends Tostrable[],
				F extends Tostrable,
				R extends string = ''>
				= (S extends [infer I extends Tostrable, ...infer S extends [any, ...any[]]]
					? Joined<S, F, `${R}${I}${F}`>
					: `${R}${S[0]}`
				);
			export type Shifted<T extends AnyArr> = T extends readonly [any, ...infer T] ? T : T;
			export enum TypeId {
				CommandRslt,
				Selected,
				SimTag,
			}
			export enum CbType {
				Impulse = 0,
				ImpulseCon = 1,
				Chain = 2,
				ChainCon = 3,
				Repeat = 4,
				RepeatCon = 5,
			}
			export interface RoundParsed extends Array<import('../genast').AST> {
			}
			export type Mods =
				| Exclude<keyof typeof import('..'), 'default'>
				| 'cli'
				| 'cmdobj'
				| 'struct'
				| 'exp'
				| 'index';
			export interface CommandRslt {
				index: number;
				tid: TypeId.CommandRslt;
			}
			export type Vcb = () => void;
			export namespace Sim {
				export interface Base {
					tid: TypeId;
					name: string;
				}
				export interface Tag extends Base {
					toString(): string;
					tid: TypeId.SimTag;
				}
			}
			export import SimTag = Sim.Tag;
			export namespace Expression {
				export type OperatorSig =
					| '!' | 'not';
				export type OperatorBin =
					| '&' | 'and'
					| '|' | 'or'
					| 'nand'
					| 'nor'
					| 'xor'
					| 'xnor';
				export type Operator =
					| OperatorBin
					| OperatorSig;
				export type Calcable = SimTag | Sub;
				export type SubSig = [OperatorSig, Calcable];
				export type SubBin = [Calcable, OperatorBin, Calcable];
				export type Sub =
					| SubSig
					| SubBin;
				export type Any = null | Calcable;
			}
			export import Expression = Expression.Any;
			export namespace Select {
				export interface Obj {
					expr: Expression;
					range: At;
					tid: TypeId.Selected;
				}
				export type At = '@r' | '@a' | '@p' | '@s' | '@e';
			}
			export import Selected = Select.Obj;
			export import SelectString = Select.At;
			export type Condition = CommandRslt | Selected;
		}
	}
}
