"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const optionKeys = [];
const Option = (_, key) => void optionKeys.push(key);
/**任务限流器 */
class Limiter {
    constructor(n = {}) {
        if ('hold' in n)
            return n;
        optionKeys.forEach(key => key in n && (this[key] = n[key]));
        this.checkIdle();
    }
    /**是否在并发数改变后立刻尝试运行空闲任务 */
    autoCheckIdle = true;
    /**最大并发数量 */
    set concurrency(n) {
        n < 0 && (n = Infinity);
        this._concurrency = n;
        if (this.autoCheckIdle)
            this.checkIdle();
    }
    get concurrency() { return this._concurrency; }
    _concurrency = Infinity;
    running = 0;
    waiters = [];
    /**检查并运行空闲的任务 */
    checkIdle() {
        while (this.waiters.length && this.running < this._concurrency) {
            this.waiters.shift()();
            ++this.running;
        }
    }
    /**阻塞代码并获得释放器 */
    hold() {
        return new Promise(res => {
            let ender = () => {
                --this.running;
                this.checkIdle();
                ender = null;
            };
            const execute = () => res(() => ender?.());
            this.waiters.push(execute);
            this.checkIdle();
        });
    }
    async run(fn) {
        const release = await this.hold();
        try {
            return await fn();
        }
        finally {
            release();
        }
    }
}
exports.default = Limiter;
__decorate([
    Option
], Limiter.prototype, "autoCheckIdle", void 0);
__decorate([
    Option
], Limiter.prototype, "concurrency", null);
//# sourceMappingURL=index.js.map