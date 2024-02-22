"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regEnum = exports.sureObj = exports.getEnumName = exports.initText = void 0;
const env_1 = __importDefault(require("./env"));
const tool_1 = require("./tool");
function initText(n) {
    return n;
}
exports.initText = initText;
const enumNameMap = new Map;
function getEnumName(n) {
    return enumNameMap.get(n) ?? (0, tool_1.throwErr)('ErrUnregisteredEnum', Error(), n);
}
exports.getEnumName = getEnumName;
function sureObj(obj) {
    return obj[env_1.default.config.lang]
        ?? obj[env_1.default.defaultLang]
        ?? obj[Object.keys(obj)[0]];
}
exports.sureObj = sureObj;
function regEnum(...[name, which, obj]) {
    enumNameMap.set(which, name);
    const getTextFn = (value) => sureObj(keyMap?.[value]
        ?? (0, tool_1.throwErr)('ErrNoEnumText', Error(), getEnumName(which), value));
    const keyMap = {};
    getTextFn.addTranObj = (obj) => {
        let i;
        for (i in obj) {
            const k = which[i];
            const ele = obj[i];
            keyMap[k] = typeof ele === 'string' ? { [env_1.default.defaultLang]: ele } : ele;
        }
        return getTextFn;
    };
    if (obj)
        getTextFn.addTranObj(obj);
    return getTextFn;
}
exports.regEnum = regEnum;
//# sourceMappingURL=text.js.map