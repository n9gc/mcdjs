"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdErr = exports.checkHolded = exports.trapErr = exports.errCatcher = exports.throwErr = exports.clearErr = exports.getTracker = exports.EType = void 0;
const env_1 = __importDefault(require("../config/env"));
const text_1 = require("../config/text");
const errors_1 = require("./errors");
Object.defineProperty(exports, "EType", { enumerable: true, get: function () { return errors_1.EType; } });
const text_2 = require("./text");
let trackerMap;
function getTrackerDefault() {
    if (trackerMap)
        return trackerMap;
    trackerMap = {};
    for (const i in text_2.some.tracker)
        trackerMap[i] = Error(text_2.some.tracker[i]);
    return trackerMap;
}
function getTracker() {
    if (env_1.default.config.track)
        return Error();
    return (0, text_1.sureObj)(getTrackerDefault());
}
exports.getTracker = getTracker;
function clearErr(n) {
    return {
        ...n,
        type: (0, text_2.tranumEType)(n.type),
    };
}
exports.clearErr = clearErr;
function throwErr(...args) {
    const [err] = args;
    if (typeof err !== 'object')
        return throwErr((0, errors_1.GetErr)(...args));
    const c = clearErr(err);
    console.error('\n\x1b[37m\x1b[41m McdJS 错误 \x1b[0m', c);
    if (typeof globalThis.process?.exit === 'function')
        process.exit(9);
    else
        throw c;
}
exports.throwErr = throwErr;
const errCatcher = (err) => throwErr(err);
exports.errCatcher = errCatcher;
function trapErr(rej, ...eles) {
    return () => rej((0, errors_1.GetErr)(...eles));
}
exports.trapErr = trapErr;
const holdeds = [];
function checkHolded() {
    let fn;
    while (fn = holdeds.pop(), holdeds.length)
        fn?.();
}
exports.checkHolded = checkHolded;
function getHoldFn(fn) {
    const rfn = fn;
    rfn.addKey = (n) => function (k) {
        return (fn(k) ? (delete this[n], true) : false);
    };
    return rfn;
}
function holdErr(...args) {
    const cb = () => {
        clearTimeout(timer);
        throwErr(...args);
    };
    const timer = setTimeout(cb);
    const index = holdeds.push(cb);
    let unend = true;
    return getHoldFn((tracker) => {
        if (tracker)
            return args[1] = tracker, throwErr(...args);
        if (unend) {
            delete holdeds[index];
            clearTimeout(timer);
            unend = false;
            return true;
        }
        else
            return false;
    });
}
exports.holdErr = holdErr;
//# sourceMappingURL=index.js.map