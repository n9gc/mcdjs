/**
 * 元配置相关
 * @module mcdjs/lib/config/env
 * @version 1.0.2
 * @license GPL-3.0-or-later
 */
declare module './env';

import type { Lang } from '../types/base';

export interface Config {
	lang: Lang;
	track: boolean;
}

export const env = {
	defaultLang: 'zh-CN',
	config: {
		lang: 'zh-CN',
		track: true,
	} as Config,
	setConfig(conf: Config) {
		return Object.assign(this.config, conf);
	},
} as const;
export default env;
