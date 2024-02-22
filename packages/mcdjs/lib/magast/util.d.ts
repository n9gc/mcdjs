/**
 * 树操作工具库
 * @module mcdjs/lib/magast/util
 * @version 1.0.1
 * @license GPL-2.0-or-later
 */
declare module './util';
export declare const some: {
    report: {
        'zh-CN': string;
    };
};
export declare enum TransfSignal {
    Stop = 0,
    Next = 1
}
export declare const tranumTransfSignal: import("../config/text").GetTextFn<typeof TransfSignal>;
export declare class TransfError extends Error {
    static assert(err: unknown): asserts err is TransfError;
    constructor(signal: TransfSignal);
    cause: {
        signal: TransfSignal;
        info: string;
    };
}
export declare function guard(n: boolean): asserts n;
