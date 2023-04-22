/**
 * *McdJS* - 用 JS 编写你的指令！
 * @module mcdjs
 * @version 0.9.4
 * @license GPL-3.0-or-later
 * @see https://github.com/n9gc/mcdjs 在线代码仓库
 */
declare module '.';

import { versions as mcdjsBaseVer } from '@mcdjs/base';
import { versions as aocudeoVer } from 'aocudeo';
export const versions = {
	mcdjs: '0.9.4',
	...mcdjsBaseVer,
	...aocudeoVer,
} as const;

export * as config from '@mcdjs/base/dist/config';
export * as errlib from '@mcdjs/base/dist/errlib';
export * as types from '@mcdjs/base/dist/types';
export * as default from '.';
export * as alload from './alload';
export * as appinf from './appinf';
export * as magast from './magast';
export * as transf from './transf';
