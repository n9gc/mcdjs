/**
 * 文本配置处理相关
 * @module mcdjs/lib/config/text
 * @version 1.1.0
 * @license GPL-2.0-or-later
 */
declare module './text';
import type { Enum, Lang } from '../types/base';
import type { SigreqObj } from '../types/tool';
export type Obj<T = string, N extends Lang = Lang> = (N extends N ? SigreqObj<N, Lang, T> : never);
export declare function initText<K extends string, T = {
    [I in K]: Obj;
}>(n: T): T;
export declare function getEnumName<B extends Enum>(n: B): string;
export type EnumTextMap<B extends Enum> = {
    [I in Enum.ValueOf<B>]?: Obj;
};
export type TranObj<B extends Enum> = {
    [I in Enum.KeyOf<B>]?: Obj | string;
};
export type RegArgs<B extends Enum> = [name: string, which: B, obj?: TranObj<B>];
export interface GetTextFn<B extends Enum> {
    (value: Enum.ValueOf<B>): string;
    addTranObj(obj: TranObj<B>): this;
}
export declare function sureObj<N>(obj: Obj<N>): N;
export declare function regEnum<B extends Enum>(...[name, which, obj]: RegArgs<B>): GetTextFn<B>;
