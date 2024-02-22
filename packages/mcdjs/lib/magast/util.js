"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = exports.TransfError = exports.tranumTransfSignal = exports.TransfSignal = exports.some = void 0;
const text_1 = require("../config/text");
exports.some = (0, text_1.initText)({
    report: {
        'zh-CN': '转义中出现错误',
    },
});
var TransfSignal;
(function (TransfSignal) {
    TransfSignal[TransfSignal["Stop"] = 0] = "Stop";
    TransfSignal[TransfSignal["Next"] = 1] = "Next";
})(TransfSignal || (exports.TransfSignal = TransfSignal = {}));
exports.tranumTransfSignal = (0, text_1.regEnum)('TransfSignal', TransfSignal, {
    Stop: '中断遍历',
    Next: '结束当前函数',
});
class TransfError extends Error {
    static assert(err) {
        if (!(err instanceof TransfError))
            throw err;
    }
    constructor(signal) {
        super((0, text_1.sureObj)(exports.some.report));
        this.cause = { signal, info: (0, exports.tranumTransfSignal)(signal) };
    }
    cause;
}
exports.TransfError = TransfError;
function guard(n) {
    if (!n)
        throw new TransfError(TransfSignal.Stop);
}
exports.guard = guard;
//# sourceMappingURL=util.js.map