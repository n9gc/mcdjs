"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleChecker = exports.SignChecker = void 0;
const organizer_1 = require("./organizer");
const util_1 = require("./util");
class SignChecker {
    ensureds = new Set();
    requireds = new Set();
    countEnsureds() {
        return this.ensureds.size;
    }
    getEnsureds() {
        return new Set(this.ensureds);
    }
    isEnsured(id) {
        return this.ensureds.has(id);
    }
    isRequired(id) {
        return this.requireds.has(id);
    }
    ensure(...ids) {
        ids.forEach(id => {
            this.ensureds.add(id);
            this.requireds.delete(id);
        });
    }
    require(...ids) {
        ids.forEach(id => this.ensureds.has(id) || this.requireds.add(id));
    }
    tryThrow() {
        if (this.requireds.size)
            (0, util_1.throwError)(3, Error('出现了未注册的模块'), { list: this.requireds });
    }
}
exports.SignChecker = SignChecker;
class CircleChecker {
    edgeMap;
    circle = [];
    checkedChecker = new SignChecker();
    out(id) {
        this.circle.splice(0, this.circle.indexOf(id));
        return true;
    }
    mark(id) {
        this.checkedChecker.require(id);
        this.circle.push(id);
    }
    unmark(id) {
        this.checkedChecker.ensure(id);
        this.circle.pop();
    }
    from(id) {
        if (this.checkedChecker.isEnsured(id))
            return false;
        if (this.checkedChecker.isRequired(id))
            return this.out(id);
        this.mark(id);
        for (const p of this.edgeMap[id])
            if (this.from(p))
                return true;
        this.unmark(id);
        return false;
    }
    /**@deprecated 请使用 {@link CircleChecker.prototype.tryThrow|`CircleChecker#tryThrow`} 代替此方法 */
    throw() { this.tryThrow(); }
    tryThrow() {
        (0, util_1.throwError)(2, Error('出现环形引用'), { circle: this.circle });
    }
    constructor(edgeMap) {
        this.edgeMap = edgeMap;
        if (!this.from(organizer_1.Organizer.start))
            this.tryThrow = () => { };
    }
}
exports.CircleChecker = CircleChecker;
//# sourceMappingURL=checker.js.map