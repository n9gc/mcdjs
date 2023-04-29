/**
 * *McdJS* 通用工具库
 * @module @mcdjs/base
 * @version 1.0.1
 * @license GPL-3.0-or-later
 * @see https://github.com/n9gc/mcdjs 在线代码仓库
 */
/// <reference types="node" />
declare module '.';

export const versions = {
	'@mcdjs/base': '1.0.1',
} as const;

export * as config from './config';
export * as errlib from './errlib';
export * as types from './types';
