"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionMap = exports.PositionObj = exports.SurePosition = void 0;
const checker_1 = require("./checker");
const diagram_1 = require("./diagram");
const executor_1 = require("./executor");
const organizer_1 = require("./organizer");
const util_1 = require("./util");
class SurePosition {
    static keys = ['after', 'before'];
    static fillSet(surePosition) {
        SurePosition.keys.forEach(key => surePosition[key] || (surePosition[key] = new Set()));
    }
    static fill(surePosition) {
        this.fillSet(surePosition);
        return surePosition;
    }
    constructor(positionObj) {
        const preOf = (0, util_1.getArray)(positionObj.preOf || []);
        const postOf = (0, util_1.getArray)(positionObj.postOf || []);
        this.after = new Set([
            ...(0, util_1.getArray)(positionObj.after || []),
            ...preOf.map(id => organizer_1.Organizer.affixPre + id),
            ...postOf.map(id => organizer_1.Organizer.affixMain + id),
        ]);
        this.before = new Set([
            ...(0, util_1.getArray)(positionObj.before || []),
            ...preOf.map(id => organizer_1.Organizer.affixMain + id),
            ...postOf.map(id => organizer_1.Organizer.affixPost + id),
        ]);
    }
    after;
    before;
}
exports.SurePosition = SurePosition;
/**位置信息对象 */
class PositionObj {
    static keys = [...SurePosition.keys, 'preOf', 'postOf'];
    constructor(position) {
        if (typeof position !== 'object')
            position = [position];
        if ('length' in position)
            this.after = position;
        else
            return position;
    }
    preJudger;
    postJudger;
    /**此模块依赖的模块 */
    after;
    /**依赖此模块的模块 */
    before;
    /**挂在哪些模块前面作为钩子 */
    preOf;
    /**挂在哪些模块后面作为钩子 */
    postOf;
}
exports.PositionObj = PositionObj;
class PositionMap {
    constructor() {
        this.insertedChecker.ensure(organizer_1.Organizer.start, organizer_1.Organizer.end);
        this.insert(organizer_1.Organizer.end, organizer_1.Organizer.start);
    }
    insertedChecker = new checker_1.SignChecker;
    countMap = new Map();
    surePositionMap = new util_1.SurePositionMap();
    push(id, surePosition) {
        const mapObj = this.surePositionMap.forceGet(id);
        SurePosition.keys.forEach(key => surePosition[key].forEach(id => mapObj[key].add(id)));
        const len = mapObj.after.size + mapObj.before.size;
        this.countMap.set(id, len);
        return len;
    }
    splitedChecker = new checker_1.SignChecker;
    surelyInsert(id, surePosition) {
        if (typeof id === 'symbol' || !this.splitedChecker.isEnsured(id))
            return this.push(id, surePosition);
        const { preId, mainId, postId } = organizer_1.Organizer.getAffixedOf(id);
        const len = this.countMap.get(mainId)
            + this.surelyInsert(preId, SurePosition.fill({ after: surePosition.after }))
            + this.surelyInsert(postId, SurePosition.fill({ before: surePosition.before }));
        this.countMap.set(id, len);
        return len;
    }
    split(id) {
        const { preId, mainId, postId } = organizer_1.Organizer.getAffixedOf(id);
        this.splitedChecker.ensure(id);
        this.insertedChecker.ensure(preId, mainId, postId);
        this.push(preId, SurePosition.fill({ after: this.surePositionMap.get(id)?.after }));
        this.push(mainId, new SurePosition({}));
        this.push(postId, SurePosition.fill({ before: this.surePositionMap.get(id)?.before }));
        this.surePositionMap.delete(id);
    }
    requireSplited(id) {
        if (id === false)
            return false;
        if (this.splitedChecker.isRequired(id))
            return false;
        if (this.splitedChecker.isEnsured(id))
            return true;
        if (this.requireSplited(organizer_1.Organizer.getHookedOf(id))) {
            this.split(id);
            return true;
        }
        else {
            this.splitedChecker.require(id);
            return false;
        }
    }
    clearHolded(id) {
        this.split(id);
        organizer_1.Organizer.affixs.forEach(affix => this.splitedChecker.isRequired(affix + id) && this.clearHolded(affix + id));
    }
    ensureSplited(id) {
        if (typeof id === 'symbol')
            return this.insertedChecker.ensure(id), false;
        if (id === false)
            return true;
        if (this.splitedChecker.isEnsured(id))
            return false;
        if (this.splitedChecker.isRequired(id)) {
            if (this.ensureSplited(organizer_1.Organizer.getHookedOf(id))) {
                this.insertedChecker.ensure(id);
                this.clearHolded(id);
            }
            return false;
        }
        else {
            if (this.ensureSplited(organizer_1.Organizer.getHookedOf(id)))
                this.insertedChecker.ensure(id);
            this.split(id);
            return false;
        }
    }
    insert(id, position) {
        const siz = this.insertedChecker.countEnsureds();
        const len = this.countMap.get(id);
        const surePosition = new SurePosition(new PositionObj(position));
        if (surePosition.before.has(organizer_1.Organizer.start))
            this.insertError = [0, id];
        if (surePosition.after.has(organizer_1.Organizer.end))
            this.insertError = [1, id];
        SurePosition.keys.forEach(key => this.insertedChecker.require(...surePosition[key]));
        SurePosition.keys.forEach(key => surePosition[key]?.forEach(id => this.requireSplited(organizer_1.Organizer.getHookedOf(id))));
        this.ensureSplited(id);
        this.surelyInsert(id, surePosition);
        if (this.insertedChecker.countEnsureds() !== siz || this.countMap.get(id) !== len)
            this.clearCache();
    }
    clearCache() {
        this.graphCache = null;
        this.diagramCache = null;
    }
    graphCache = null;
    getGraph() {
        return this.graphCache || (this.graphCache = new executor_1.Graph(this.surePositionMap, this.splitedChecker));
    }
    diagramCache = null;
    getDiagram() {
        return this.diagramCache || (this.diagramCache = new diagram_1.Diagram([...this.surePositionMap.keys()], this.getGraph().edgeMap));
    }
    insertError = null;
    throwInsertError() {
        if (!this.insertError)
            return;
        const [type, id] = this.insertError;
        (0, util_1.throwError)(this.insertError[0], Error(`在 ${type ? 'Organizer.end 后' : 'Organizer.start 前'}插入位置`), { id });
    }
    tryThrow() {
        this.throwInsertError();
        this.insertedChecker.tryThrow();
        this.getGraph().tryThrow();
    }
}
exports.PositionMap = PositionMap;
//# sourceMappingURL=position.js.map