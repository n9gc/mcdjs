"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.globalify = void 0;
const generator_1 = __importDefault(require("./generator"));
const magast_1 = require("./magast");
const plugin_1 = __importDefault(require("./plugin"));
function globalify({ api }) {
    globalify.methodKeys.forEach(key => globalThis[key] = function fn(...args) {
        return this instanceof fn ? new api[key](...args) : api[key](...args);
    });
    globalify.attributeKeys.forEach(key => globalThis[key] = api[key]);
}
exports.globalify = globalify;
(function (globalify) {
    globalify.methodKeys = new Set();
    globalify.attributeKeys = new Set();
    function Export(proto, key) {
        (typeof proto[key] === 'function' ? globalify.methodKeys : globalify.attributeKeys).add(key);
    }
    globalify.Export = Export;
    function clear() {
        globalify.methodKeys.forEach(key => delete globalThis[key]);
        globalify.attributeKeys.forEach(key => delete globalThis[key]);
    }
    globalify.clear = clear;
})(globalify || (exports.globalify = globalify = {}));
async function parse(tips, fn, option = {}) {
    const operm = new magast_1.Operator(tips);
    if (option.globalify)
        globalify(operm);
    await fn(operm.api);
    if (option.globalify)
        globalify.clear();
    await (0, plugin_1.default)(operm);
    return (0, generator_1.default)(operm.ast, option);
}
exports.parse = parse;
//# sourceMappingURL=appinf.js.map