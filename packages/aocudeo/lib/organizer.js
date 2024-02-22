"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerSync = exports.OrganizerAsync = exports.Organizer = exports.AffixsToolKit = void 0;
const task_simple_limiter_1 = __importDefault(require("task-simple-limiter"));
const position_1 = require("./position");
const util_1 = require("./util");
const worker_1 = require("./worker");
class AffixsToolKit {
    static hookTypes = [
        'Pre',
        'Main',
        'Post',
    ];
    static _affixPre = 'pre:';
    static get affixPre() { return this._affixPre; }
    static set affixPre(n) { this.setAffix('Pre', n); }
    static _affixMain = 'main:';
    static get affixMain() { return this._affixMain; }
    static set affixMain(n) { this.setAffix('Main', n); }
    static _affixPost = 'post:';
    static get affixPost() { return this._affixPost; }
    static set affixPost(n) { this.setAffix('Post', n); }
    static setAffix(type, n) {
        this[`_affix${type}`] = n;
        this.affixs = this.getAffixs();
        this.hookTypeMap = this.getHookTypeMap();
    }
    static affixs = this.getAffixs();
    static getAffixedOf(id) {
        return {
            preId: this._affixPre + id,
            mainId: this._affixMain + id,
            postId: this._affixPost + id,
        };
    }
    /**@deprecated 请使用 {@link AffixsToolKit.getAffixedOf|`AffixsToolKit.getAffixedOf`} 代替此方法 */
    static getAffixed(id) { return this.getAffixedOf(id); }
    static getAffixs() {
        return [
            this._affixPre,
            this._affixMain,
            this._affixPost,
        ];
    }
    static getHookTypeMap() {
        return {
            [this._affixPre]: 'Pre',
            [this._affixMain]: 'Main',
            [this._affixPost]: 'Post',
        };
    }
    static hookTypeMap = this.getHookTypeMap();
    static getHookTypeOf(id) {
        if (typeof id !== 'string')
            return false;
        for (const affix of Organizer.affixs)
            if (id.slice(0, affix.length) === affix)
                return this.hookTypeMap[affix];
        return false;
    }
    /**@deprecated 请使用 {@link AffixsToolKit.getHookTypeOf|`AffixsToolKit.getHookTypeOf`} 代替此方法 */
    static getHookType(id) { return this.getHookTypeOf(id); }
    static getHookedOf(id) {
        if (typeof id !== 'string')
            return false;
        for (const affix of Organizer.affixs)
            if (id.slice(0, affix.length) === affix)
                return id.slice(affix.length);
        return false;
    }
    static ensureHookedPart(hooked, type) {
        const hookType = Organizer.getHookTypeOf(hooked);
        if (!hookType)
            return type;
        if (hookType !== type)
            return 'Body';
        return this.ensureHookedPart(Organizer.getHookedOf(hooked), type);
    }
    static getHookedPartOf(id) {
        if (typeof id === 'symbol')
            return 'All';
        const hookType = Organizer.getHookTypeOf(id);
        if (!hookType || hookType === 'Main')
            return 'Body';
        return this.ensureHookedPart(Organizer.getHookedOf(id), hookType);
    }
}
exports.AffixsToolKit = AffixsToolKit;
class Organizer extends AffixsToolKit {
    static start = Symbol('load start');
    static end = Symbol('load end');
    static unknown = Symbol('unknown module');
    constructor({ workers = {}, positions = {}, reusable } = {}) {
        super();
        if (typeof reusable !== 'undefined')
            this.reusable = reusable;
        this.addWorkers(workers);
        this.addPositions(positions);
    }
    /**是否可以重用 */
    reusable = true;
    /**是否已经加载完一次了 */
    loaded = false;
    positionMap = new position_1.PositionMap();
    /**
     * 插入模块
     * @param id 模块标识符
     * @param position 位置信息
     * @param worker 动作回调
     */
    addPosition(id, position = {}, worker = null) {
        if (worker)
            this.addWorker(id, worker);
        this.positionMap.insert(id, position);
        return this;
    }
    /**
     * 插入多个模块
     * @param positions 各个模块的位置信息
     */
    addPositions(positions) {
        (0, util_1.isArray)(positions)
            ? ((0, util_1.isIdArray)(positions) ? [positions] : positions).forEach(array => {
                this.addPosition(array[0]);
                array.length < 2 || array.reduce((p, t) => (this.addPosition(t, p), t));
            })
            : (0, util_1.mapMap)(positions, (position, id) => this.addPosition(id, position));
        return this;
    }
    workerManager = new worker_1.WorkerManager();
    /**
     * 增加动作回调
     * @param id 要增加的模块
     * @param worker 动作回调
     * @param noInsert 若模块不存在，是否不要主动插入
     */
    addWorker(id, worker, noInsert) {
        if (!noInsert)
            this.positionMap.insert(id, {});
        this.workerManager.add(id, worker);
        return this;
    }
    /**
     * 增加多个模块的动作回调
     * @param workers 各个模块的动作回调
     * @param noInsert 是否不要主动插入 {@link workers} 中未被插入的模块
     */
    addWorkers(workers, noInsert) {
        (0, util_1.mapMap)(workers, (worker, id) => this.addWorker(id, worker, noInsert));
        return this;
    }
    tryThrow() {
        this.positionMap.tryThrow();
    }
    // private walkAt(id: Id, countMap: MapObj<number>, path: Id[]) {
    // 	if (--countMap[id]) return;
    // 	path.push(id);
    // 	this.postListMap[id]?.forEach(id => this.walkAt(id, countMap, path));
    // }
    // /**得到运行顺序数组 */
    // walk() {
    // 	this.checkLost();
    // 	this.checkCircle();
    // 	const path: Id[] = [];
    // 	this.walkAt(Organizer.start, this.getCount(), path);
    // 	return path;
    // }
    getExecutor(data) {
        return this.positionMap.getGraph().getExecutor(this.workerManager.getRunner(data));
    }
    /**
     * 加载！
     * @param data 初始运行参数
     */
    execute(data) {
        if (!this.reusable && this.loaded)
            return true;
        this.tryThrow();
        this.loaded = true;
        return false;
    }
    getDiagram() {
        return this.positionMap.getDiagram();
    }
}
exports.Organizer = Organizer;
/**异步模块加载器 */
class OrganizerAsync extends Organizer {
    constructor({ concurrency = 0, ...organizerConfig } = {}) {
        super(organizerConfig);
        this.concurrency = concurrency;
    }
    /**最大同时任务数量 */
    concurrency;
    execute(data, limiterOption = {}) {
        return super.execute()
            ? data
            : this.getExecutor(data).executeAsync(new task_simple_limiter_1.default(limiterOption));
    }
}
exports.OrganizerAsync = OrganizerAsync;
/**模块加载器 */
class OrganizerSync extends Organizer {
    execute(data) {
        return super.execute()
            ? data
            : this.getExecutor(data).executeSync();
    }
}
exports.OrganizerSync = OrganizerSync;
//# sourceMappingURL=organizer.js.map