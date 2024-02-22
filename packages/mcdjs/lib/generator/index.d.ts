/**
 * 指令生成模块
 * @module mcdjs/lib/generator
 * @version 1.1.0
 * @license GPL-2.0-or-later
 */
declare module '.';
import type { ParseOption } from "../appinf";
import { Ast } from "../magast/nodes";
import { Formatter, InternalFormatter } from './formatters';
import { Grouper, InternalGrouper } from "./groupers";
import { InternalNoter, Noter } from "./noters";
export interface GenerateOption {
    /**
     * 指令输出的形式
     * - `"MPText"` 《MC 指令设计》系列教程中所采用的表达方式
     * - `Formatter` 可自定义的函数
     * @default "MPText"
     */
    formatter?: InternalFormatter | Formatter;
    /**
     * 注释的形式，若为空则使用 {@link formatter} 字段的值
     * - `"MPText"` 《MC 指令设计》系列教程中所采用的表达方式
     * - `"Log"` 使用 say 指令说出注释
     * - `Noter` 可自定义的函数
     * @default "MPText"
     */
    noter?: InternalNoter | Noter;
    /**
     * 分组的形式，若为空则使用 {@link formatter} 字段的值
     * - `"MPText"` 《MC 指令设计》系列教程中所采用的表达方式
     * - `"Log"` 使用 say 指令说出注释
     * - `Noter` 可自定义的函数
     * @default "MPText"
     */
    grouper?: InternalGrouper | Grouper;
}
export default function generate(ast: Ast, option: ParseOption): Promise<{
    text: string;
    ast: {
        ntype: 15;
        readonly tips: string;
        readonly nodes: (import("../../lib-splited").CodeBlock | import("../../lib-splited").Command | import("../../lib-splited").Branch | import("../../lib-splited").CBGroup | import("../../lib-splited").NameSpace | import("../../lib-splited").CommandRslt | import("../../lib-splited").Selector | import("../../lib-splited").ExpressionAnd | import("../../lib-splited").ExpressionOr | import("../../lib-splited").ExpressionNot | import("../../lib-splited").ExpressionNand | import("../../lib-splited").ExpressionNor | import("../../lib-splited").ExpressionXor | import("../../lib-splited").ExpressionXnor | {
            ntype: 14;
            readonly system: any;
            readonly index: number;
            tips?: string | undefined;
        } | any)[];
        readonly index: number;
    };
    tips: string;
    option: ParseOption;
}>;
export interface Generated extends ReturnType<typeof generate> {
}
export * from './genevents';
