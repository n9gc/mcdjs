"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = exports.Graph = void 0;
const checker_1 = require("./checker");
const organizer_1 = require("./organizer");
class Graph {
    splitedChecker;
    edgeMap = Object.create(null);
    indegreeMap = Object.create(null);
    putInList(id, ids) {
        (this.edgeMap[id] || (this.edgeMap[id] = [])).push(...ids);
    }
    plusCount(id, num = 1) {
        this.indegreeMap[id] = (this.indegreeMap[id] || 0) + num;
    }
    insertAfter(id, after) {
        after.forEach(n => this.putInList(n, [id]));
        this.plusCount(id, after.length);
    }
    insertBefore(id, before) {
        this.putInList(id, before);
        before.forEach(n => this.plusCount(n));
    }
    insert(id, after, before) {
        this.insertAfter(id, after);
        this.insertBefore(id, before);
    }
    getEdgeOf(id, direction) {
        if (typeof id !== 'symbol' && this.splitedChecker.isEnsured(id))
            return this.getEdgeOf(organizer_1.Organizer[`affix${direction}`] + id, direction);
        return id;
    }
    insertEdge(id, after, before) {
        this.insertAfter(this.getEdgeOf(id, 'Pre'), after.map(id => this.getEdgeOf(id, 'Post')));
        this.insertBefore(this.getEdgeOf(id, 'Post'), before.map(id => this.getEdgeOf(id, 'Pre')));
    }
    linkSymbol(id) {
        switch (organizer_1.Organizer.getHookedPartOf(id)) {
            case 'All': return this.insert(id, [organizer_1.Organizer.start], [organizer_1.Organizer.end]);
            case 'Post': return this.insert(id, [], [organizer_1.Organizer.end]);
            case 'Pre': return this.insert(id, [organizer_1.Organizer.start], []);
        }
    }
    constructor(surePositionMap, splitedChecker) {
        this.splitedChecker = splitedChecker;
        surePositionMap.forEach(({ after, before }, id) => this.insertEdge(id, [...after], [...before]));
        [...surePositionMap.keys()].filter(id => id !== organizer_1.Organizer.end && id !== organizer_1.Organizer.start).forEach(id => this.linkSymbol(id));
        splitedChecker.getEnsureds().forEach(id => this.insertEdge(organizer_1.Organizer.affixMain + id, [organizer_1.Organizer.affixPre + id], [organizer_1.Organizer.affixPost + id]));
        this.indegreeMap[organizer_1.Organizer.start] = 1;
        const circleChecker = new checker_1.CircleChecker(this.edgeMap);
        this.tryThrow = () => circleChecker.tryThrow();
    }
    tryThrow;
    getExecutor(workRunner) {
        return new Executor(this.edgeMap, this.indegreeMap, workRunner);
    }
}
exports.Graph = Graph;
class Executor {
    edgeMap;
    workRunner;
    constructor(edgeMap, indegreeMap, workRunner) {
        this.edgeMap = edgeMap;
        this.workRunner = workRunner;
        this.indegreeMap = Object.create(indegreeMap);
    }
    indegreeMap;
    // protected judge(hookPosition: 'pre' | 'post', id: Id, n: T) {
    // 	return this.positionObjMap[id]?.[`${hookPosition}Judger`]?.(n) === false;
    // }
    executeSyncSub(id) {
        if (--this.indegreeMap[id])
            return;
        // if (this.judge('pre', id, n)) return n;
        this.workRunner.runSync(id);
        // if (this.judge('post', id, n)) return n;
        this.edgeMap[id].forEach(id => this.executeSyncSub(id));
    }
    executeSync() {
        this.executeSyncSub(organizer_1.Organizer.start);
        // this.workRunner.tryThrow();
        return this.workRunner.data;
    }
    limiter = null;
    async executeAsyncSub(id) {
        if (--this.indegreeMap[id])
            return;
        // if (this.judge('pre', id, n)) return n;
        await this.workRunner.runAsync(id, this.limiter);
        // if (this.judge('post', id, n)) return n;
        await Promise.all(this.edgeMap[id].map(id => this.executeAsyncSub(id)));
    }
    async executeAsync(limiter) {
        this.limiter = limiter;
        await this.executeAsyncSub(organizer_1.Organizer.start);
        // this.workRunner.tryThrow();
        return this.workRunner.data;
    }
}
exports.Executor = Executor;
//# sourceMappingURL=executor.js.map