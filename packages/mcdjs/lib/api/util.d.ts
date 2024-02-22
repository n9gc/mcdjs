/**
 * 实用功能
 * @module mcdjs/lib/api/util
 * @version 2.0.0
 * @license GPL-2.0-or-later
 */
declare module './util';
import type { Operator } from "../magast";
import { Template } from "../types/base";
import clsStatic from './static';
export default class clsUtil extends clsStatic {
    protected readonly opering: Operator;
    constructor(opering: Operator);
    private tipLast;
    /**提供一个注释 */
    tip(...args: Template.ArgsJoin): void;
    getTip(): string;
}
