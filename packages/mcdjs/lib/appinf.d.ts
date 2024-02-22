/**
 * 应用包装模块
 * @module mcdjs/lib/appinf
 * @version 1.3.1
 * @license GPL-2.0-or-later
 */
declare module './appinf';
import type { Api } from './api';
import { GenerateOption } from './generator';
import { Operator } from './magast';
export declare function globalify({ api }: Operator): void;
export declare namespace globalify {
    const methodKeys: Set<string>;
    const attributeKeys: Set<string>;
    function Export(proto: any, key: string): void;
    function clear(): void;
}
export interface ParseOption extends GenerateOption {
    /**
     * 是否将 API 放到全局定义域中
     * @default false
     */
    globalify?: boolean;
}
export interface ParseFunction {
    (api: Api): void | PromiseLike<any>;
}
export declare function parse(tips: string, fn: ParseFunction, option?: ParseOption): Promise<{
    text: string;
    ast: {
        ntype: 15;
        readonly tips: string;
        readonly nodes: (import("../lib-splited").CodeBlock | import("../lib-splited").Command | import("../lib-splited").Branch | import("../lib-splited").CBGroup | import("../lib-splited").NameSpace | import("../lib-splited").CommandRslt | import("../lib-splited").Selector | import("../lib-splited").ExpressionAnd | import("../lib-splited").ExpressionOr | import("../lib-splited").ExpressionNot | import("../lib-splited").ExpressionNand | import("../lib-splited").ExpressionNor | import("../lib-splited").ExpressionXor | import("../lib-splited").ExpressionXnor | {
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
