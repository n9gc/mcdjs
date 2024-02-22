"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwErr = exports.getImp = void 0;
function getImp() {
    return getImp.Imp || (getImp.Imp = require('..'));
}
exports.getImp = getImp;
(function (getImp) {
})(getImp || (exports.getImp = getImp = {}));
function throwErr(n, tracker, ...args) {
    return getImp().errlib.throwErr(getImp().errlib.EType[n], tracker, ...args);
}
exports.throwErr = throwErr;
//# sourceMappingURL=tool.js.map