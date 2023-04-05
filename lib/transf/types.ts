/**
 * 转译相关定义模块
 * @module mcdjs/lib/transf/types
 * @version 1.0.1
 * @license GPL-3.0-or-later
 */
declare module './types';

import { Types } from '../alload';
import { NTypeKey, PathInfo } from '../genast';
import EachOfUnion = Types.EachOfUnion;
import UniqueItems = Types.UniqueItems;

export interface VistorFn {
	(pathInfo: PathInfo): void;
}
export interface VistorObj {
	entry?: VistorFn;
	exit?: VistorFn;
}
export type Vistor = VistorObj | VistorFn;
export type VistorName =
	Types.Joined<Exclude<UniqueItems<EachOfUnion<NTypeKey>>, []>, '|'> | 'all';
	// string;
export type TransfModule = {
	[I in VistorName]?: Vistor;
};
