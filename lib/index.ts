/**
 * *McdJS* - 用 JS 编写你的指令！
 * @module mcdjs
 * @version 0.9.2
 * @license GPL-3.0-or-later
 * @see {@link https://github.com/n9gc/mcdjs 在线代码仓库}
 */
declare module '.';

import * as Def from '.';
export default Def;

/**全局加载 */
export * as struct from './struct';
export * as cmdobj from './cmdobj';

/**模块加载 */
export * as appinf from './appinf';
export * as config from './config';
export * as errlib from './errlib';
export * as hoaxer from './hoaxer';
export * as genast from './genast';
