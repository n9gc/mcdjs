"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    defaultLang: 'zh-CN',
    config: {
        lang: 'zh-CN',
        track: true,
    },
    setConfig(conf) {
        return Object.assign(this.config, conf);
    },
};
exports.default = exports.env;
//# sourceMappingURL=env.js.map