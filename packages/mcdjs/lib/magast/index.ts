/**
 * 内部抽象语法树模块
 * @module mcdjs/lib/magast
 * @version 1.0.2
 * @license GPL-3.0-or-later
 */
declare module '.';

import { reger0 } from '../alload';

export const reger1 = reger0('magast', exports);
export { default as Operator } from './operator';
export { default as PathInfo } from './pathinfo';
