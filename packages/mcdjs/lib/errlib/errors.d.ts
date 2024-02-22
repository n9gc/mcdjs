/**
 * 错误类型定义模块
 * @module mcdjs/lib/errlib/errors
 * @version 1.6.1
 * @license GPL-2.0-or-later
 */
declare module './errors';
import type { PathInfo } from '../magast';
import type { Node } from '../magast/nodes';
import type { TransfError } from '../magast/util';
import { Enum } from '../types/base';
export interface ErrBase {
    type: EType;
    tracker: Error;
}
export declare const errs: {
    readonly ErrNoSuchFile: (files: string[]) => {
        files: string[];
    };
    readonly ErrNoParser: () => {};
    readonly ErrNoSuchErr: (throwTracker: Error) => {
        throwTracker: Error;
    };
    readonly ErrCannotBeImported: (moduleName: string) => {
        moduleName: string;
    };
    readonly ErrUseBeforeDefine: (varName: string) => {
        varName: string;
    };
    readonly ErrCannotBeSeted: (varName: string) => {
        varName: string;
    };
    readonly ErrIllegalParameter: (args: IArguments | readonly any[]) => {
        args: IArguments | readonly any[];
    };
    readonly ErrForgetPathInfo: (node: Node) => {
        node: Node;
    };
    readonly ErrIllegalVisitorName: (name: string) => {
        name: string;
    };
    readonly ErrNoEnumText: (enumDomain: string, enumNumber: number) => {
        enumDomain: string;
        enumNumber: number;
    };
    readonly ErrUnregisteredEnum: (enumObj: Enum) => {
        enumObj: Enum.Enum;
    };
    readonly ErrInitWithoutGetter: (domain: string, instance: Node) => {
        domain: string;
        instance: Node;
    };
    readonly ErrNotInList: (path: PathInfo<any, any>) => {
        path: PathInfo<any, any>;
    };
    readonly ErrWrongTransfErrorSignal: (error: TransfError) => {
        error: TransfError;
    };
};
export declare const EType: Readonly<{
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
} & import("../types/tool").MapOfArray<readonly ["ErrNoSuchFile", "ErrNoParser", "ErrNoSuchErr", "ErrCannotBeImported", "ErrUseBeforeDefine", "ErrCannotBeSeted", "ErrIllegalParameter", "ErrForgetPathInfo", "ErrIllegalVisitorName", "ErrNoEnumText", "ErrUnregisteredEnum", "ErrInitWithoutGetter", "ErrNotInList", "ErrWrongTransfErrorSignal"]>>;
type ETypeObj = typeof EType;
type ETypeStrKey = Enum.KeyOf<ETypeObj>;
export type EType<T extends ETypeStrKey = ETypeStrKey> = Enum.ValueOf<ETypeObj, T>;
export type ETypeKey<V extends EType = EType> = Enum.KeyOf<ETypeObj, V>;
export type Err<T extends EType = any> = ReturnType<(typeof errs)[ETypeKey<T>]> & ErrBase;
export type ArgGetErr<T extends EType> = [type: T, tracker: Error, ...ele: ArgGetErrList[T]];
export type ArgGetErrList = {
    [I in EType]: Parameters<(typeof errs)[ETypeKey<I>]>;
};
export declare function GetErr<B extends EType>(...pele: ArgGetErr<B>): Err<B>;
export {};
