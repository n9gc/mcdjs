/**
 * *McdJS* - 用 JS 编写你的指令！
 * @version 0.9.0
 * @license GPL-3.0-or-later
 * @see {@link https://github.com/n9gc/mcdjs 在线代码仓库}
 */
declare module '.';

import * as parser from './parser';
export { parser };

import * as command from './command';
export { command };

import * as Def from '.';
export default Def;
