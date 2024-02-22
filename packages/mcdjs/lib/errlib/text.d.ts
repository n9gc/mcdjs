/**
 * 错误相关文本
 * @module mcdjs/lib/errlib/text
 * @version 1.1.0
 * @license GPL-2.0-or-later
 */
declare module './text';
export declare const some: {
    tracker: {
        'zh-CN': string;
    };
};
export declare const tranumEType: import("../config/text").GetTextFn<Readonly<{
    ErrNoSuchFile: 0;
} & {
    ErrNoParser: 1;
} & {
    ErrNoSuchErr: 2;
} & {
    ErrCannotBeImported: 3;
} & {
    ErrUseBeforeDefine: 4;
} & {
    ErrCannotBeSeted: 5;
} & {
    ErrIllegalParameter: 6;
} & {
    ErrForgetPathInfo: 7;
} & {
    ErrIllegalVisitorName: 8;
} & {
    ErrNoEnumText: 9;
} & {
    ErrUnregisteredEnum: 10;
} & {
    ErrInitWithoutGetter: 11;
} & {
    ErrNotInList: 12;
} & {
    ErrWrongTransfErrorSignal: 13;
} & import("../types/tool").MapOfArray<readonly ["ErrNoSuchFile", "ErrNoParser", "ErrNoSuchErr", "ErrCannotBeImported", "ErrUseBeforeDefine", "ErrCannotBeSeted", "ErrIllegalParameter", "ErrForgetPathInfo", "ErrIllegalVisitorName", "ErrNoEnumText", "ErrUnregisteredEnum", "ErrInitWithoutGetter", "ErrNotInList", "ErrWrongTransfErrorSignal"]>>>;
