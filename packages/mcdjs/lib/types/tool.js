"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revMap = void 0;
function revMap(map) {
    const rslt = {};
    for (const key of Object.keys(map))
        rslt[map[key]] = key;
    return rslt;
}
exports.revMap = revMap;
//# sourceMappingURL=tool.js.map