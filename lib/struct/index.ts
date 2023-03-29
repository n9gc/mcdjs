/**
 * 程序结构工具模块
 * @module mcdjs/lib/struct
 * @version 1.1.0
 * @license GPL-3.0-or-later
 */
declare module '.';

import '../hoaxer';

import './base';
import './grammer';
import './types';
import './util';
import Struct = globalThis.McdJSTemp.Struct;
import Types = Struct.Types;

export default Struct;
export {
	Types,
};

