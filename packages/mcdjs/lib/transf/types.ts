/**
 * 转译相关定义模块
 * @module mcdjs/lib/transf/types
 * @version 2.0.1
 * @license GPL-3.0-or-later
 */
declare module './types';

import { VisitorName } from '@mcdjs/base/lib/types/transf';
import { PathInfo } from '../magast';

export interface VisitorFn {
	(pathInfo: PathInfo): void;
}
export interface VisitorObj {
	entry?: VisitorFn;
	exit?: VisitorFn;
}
export type Visitor = VisitorObj | VisitorFn;
export type TransfModule = {
	[I in VisitorName]?: Visitor;
};
