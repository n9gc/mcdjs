/**
 * @module mcdjs/lib-splited
 * @version 0.0.1
 * @license GPL-2.0-or-later
 */
/// <reference path="./exports.ts" />
declare module '.';
declare global {
	namespace McdJSPort {
		namespace Lib {
			export import internalTemp = me;
		}
	}
}

import * as me from '.';
export * from './nodes';
export * from './transformers';
globalThis.McdJSPort.Lib.internalTemp = me;
require('./exports');
