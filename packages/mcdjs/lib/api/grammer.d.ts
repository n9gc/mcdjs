/**
 * 实用语法相关
 * @module mcdjs/lib/api/grammer
 * @version 3.0.0
 * @license GPL-2.0-or-later
 */
declare module './grammer';
import type { Expression } from "../types/game";
import type { Vcb } from "../types/tool";
import clsCmdobj from "./cmdobj";
export default class clsGrammer extends clsCmdobj {
    /**开启一个分支结构 */
    If(expr: Expression, tdo: Vcb, fdo?: () => void): import("./static").CommandRsltClass;
}
