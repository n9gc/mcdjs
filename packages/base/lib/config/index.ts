/**
 * 配置相关
 * @module @mcdjs/base/lib/config
 * @version 5.3.0
 * @license GPL-3.0-or-later
 */
declare module '.';

export * as Text from './text';
export * as Tool from './tool';
export import Env = require('./env');
export import env = Env.env;
