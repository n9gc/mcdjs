/**
 * @module mcdjs/lib-splited
 * @version 0.0.2
 * @license GPL-2.0-or-later
 */
/// <reference path="./exports.ts" />
declare module '.';
declare global {
	namespace McdJSPort {
		namespace libs {
			export import internalTemp = me;
		}
	}
}

import * as me from '.';
export * from './nodes';
export * from './transformers';
globalThis.McdJSPort.libs.internalTemp = me;
require('./exports');
