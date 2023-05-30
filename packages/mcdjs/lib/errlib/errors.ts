/**
 * 错误类型定义模块
 * @module mcdjs/lib/errlib/errors
 * @version 1.5.1
 * @license GPL-2.0-or-later
 */
declare module './errors';

import { throwErr } from '../errlib';
import type { Node } from '../magast/nodes';
import { Enum, listKeyOf } from '../types/base';

export interface ErrBase {
	type: EType;
	tracker: Error;
}
export const errs = {
	ErrNoSuchFile: (files: string[]) => ({
		files,
	}),
	ErrNoParser: () => ({}),
	ErrNoSuchErr: (throwTracker: Error) => ({
		throwTracker,
	}),
	ErrCannotBeImported: (moduleName: string) => ({
		moduleName,
	}),
	ErrUseBeforeDefine: (varName: string) => ({
		varName,
	}),
	ErrCannotBeSeted: (varName: string) => ({
		varName,
	}),
	ErrIllegalParameter: (args: IArguments | readonly any[]) => ({
		args,
	}),
	ErrForgetPathInfo: (node: Node) => ({
		node,
	}),
	ErrIllegalVisitorName: (name: string) => ({
		name,
	}),
	ErrNoEnumText: (enumDomain: string, enumNumber: number) => ({
		enumDomain,
		enumNumber,
	}),
	ErrUnregisteredEnum: (enumObj: Enum) => ({
		enumObj,
	}),
	ErrInitWithoutGetter: (domain: string, instance: Node) => ({
		domain,
		instance,
	}),
} as const;

export const EType = Enum.from(listKeyOf(errs));
type ETypeObj = typeof EType;
type ETypeStrKey = Enum.KeyOf<ETypeObj>;
export type EType<T extends ETypeStrKey = ETypeStrKey> = Enum.ValueOf<ETypeObj, T>;
export type ETypeKey<V extends EType = EType> = Enum.KeyOf<ETypeObj, V>;

export type Err<T extends EType = any> = ReturnType<(typeof errs)[ETypeKey<T>]> & ErrBase;

export type ArgGetErr<T extends EType> = [type: T, tracker: Error, ...ele: ArgGetErrList[T]];
export type ArgGetErrList = { [I in EType]: Parameters<(typeof errs)[ETypeKey<I>]> };
export function GetErr<B extends EType>(...pele: ArgGetErr<B>) {
	const [type, tracker, ...args] = pele;
	const typeName = EType[type];
	if (!(typeName in EType)) return throwErr(EType.ErrNoSuchErr, pele[1], Error());
	const fn = errs[typeName] as (...n: typeof args) => Omit<Err<B>, keyof ErrBase>;
	return {
		type,
		...fn(...args),
		tracker,
	} as Err<B>;
}
