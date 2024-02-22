"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = exports.WorkerRunner = exports.WorkerContext = void 0;
const organizer_1 = require("./organizer");
const util_1 = require("./util");
/**模块的动作回调 */
class WorkerContext {
    id;
    maker;
    constructor(id, maker) {
        this.id = id;
        this.maker = maker;
    }
    get data() {
        return this.maker.data;
    }
    set data(n) {
        this.maker.data = n;
    }
}
exports.WorkerContext = WorkerContext;
class WorkerRunner {
    workerMap;
    data;
    constructor(workerMap, data) {
        this.workerMap = workerMap;
        this.data = data;
    }
    doFnSync(id) {
        this.workerMap.get(id)?.forEach(fn => fn(new WorkerContext(id, this)));
    }
    runSync(id) {
        this.doFnSync(id);
        if (organizer_1.Organizer.getHookTypeOf(id) === 'Main')
            return this.runSync(organizer_1.Organizer.getHookedOf(id));
    }
    doFnAsync(id) {
        return Promise.all(this.workerMap.get(id)?.map(fn => fn(new WorkerContext(id, this))));
    }
    async runAsync(id, limiter) {
        if (this.workerMap.has(id)) {
            const release = await limiter.hold();
            await this.doFnAsync(id);
            release();
        }
        if (organizer_1.Organizer.getHookTypeOf(id) === 'Main')
            return this.runAsync(organizer_1.Organizer.getHookedOf(id), limiter);
    }
}
exports.WorkerRunner = WorkerRunner;
class WorkerManager {
    workerMap = new util_1.ArrayMap();
    add(id, worker) {
        if ('run' in worker)
            worker = worker.run;
        if (!(worker instanceof Array))
            worker = [worker];
        if (!worker.length)
            return;
        this.workerMap.push(id, ...worker);
    }
    getRunner(data) {
        return new WorkerRunner(this.workerMap, data);
    }
}
exports.WorkerManager = WorkerManager;
//# sourceMappingURL=worker.js.map