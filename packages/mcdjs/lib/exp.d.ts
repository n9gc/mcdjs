/**
 * 自由奔放地导出模块
 * @module mcdjs/lib/exp
 * @version 1.2.1
 * @license GPL-2.0-or-later
 */
declare module './exp';
declare global {
    var exp: false | {
        exports: typeof Index;
    };
    var McdJS: typeof Index;
}
import * as Index from '.';
