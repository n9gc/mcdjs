"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let runed;
function default_1(n) {
    const r = process.argv[process.argv.length - 1];
    if (r.slice(0, 2) !== '-R')
        return;
    if (!runed)
        runed = r[2] === '=' ? eval(`(${r.slice(3)})`) : true;
    if (runed === true) {
        n();
        return;
    }
    const args = runed.shift();
    if (Array.isArray(args))
        n(...args);
}
exports.default = default_1;
//# sourceMappingURL=checkrun.js.map