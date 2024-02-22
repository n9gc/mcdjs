/**
 * 元配置相关
 * @module mcdjs/lib/config/env
 * @version 1.0.2
 * @license GPL-2.0-or-later
 */
declare module './env';
import type { Lang } from '../types/base';
export interface Config {
    lang: Lang;
    track: boolean;
}
export declare const env: {
    readonly defaultLang: "zh-CN";
    readonly config: Config;
    readonly setConfig: (conf: Config) => Config;
};
export default env;
