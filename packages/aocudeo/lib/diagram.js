"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagram = void 0;
const organizer_1 = require("./organizer");
class Diagram {
    idList;
    edgeMap;
    constructor(idList, edgeMap) {
        this.idList = idList;
        this.edgeMap = edgeMap;
    }
    dotLine(a, b, sign, space = 1) {
        return [
            '\t'.repeat(space),
            `"${a.toString()}" -> "${b.toString()}"`,
            // (this.postJudgerSign[a] === Organizer.EXIST || this.preJudgerSign[b] === Organizer.EXIST) && ' [style = dashed]',
        ].join('');
    }
    dotSignCache = null;
    getDotSignPrune() {
        return this.dotSignCache || (this.dotSignCache = new Set([
            this.dotLine(organizer_1.Organizer.start, organizer_1.Organizer.end),
            this.idList
                .filter(id => id !== organizer_1.Organizer.end && id !== organizer_1.Organizer.start)
                .map((id) => {
                switch (organizer_1.Organizer.getHookedPartOf(id)) {
                    case 'All': return [this.dotLine(id, organizer_1.Organizer.end), this.dotLine(organizer_1.Organizer.start, id)];
                    case 'Post': return this.dotLine(id, organizer_1.Organizer.end);
                    case 'Pre': return this.dotLine(organizer_1.Organizer.start, id);
                    case 'Body': return [];
                }
            }),
        ].flat(3)));
    }
    dotCache = null;
    getDotPrune() {
        return this.dotCache || (this.dotCache = new Set(this.idList
            .map(a => this.edgeMap[a].map(b => ({ a, b })))
            .flat()
            .filter(({ a, b }) => new Set([a, b, organizer_1.Organizer.end, organizer_1.Organizer.start]).size === 4)
            .map(({ a, b }) => this.dotLine(a, b))));
    }
    /**
     * 获取当前模块依赖关系的 DOT 图
     * @param sign 是否显示起点和终点
     */
    getDot(sign) {
        return [
            'digraph loader {',
            ...this.getDotPrune(),
            ...(sign ? this.getDotSignPrune() : []),
            '}',
        ].join('\n');
    }
    /**
     * 获取图的链接
     * @param sign 是否显示起点和终点
     */
    getUrl(sign) {
        return `http://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(this.getDot(sign))}`;
    }
}
exports.Diagram = Diagram;
//# sourceMappingURL=diagram.js.map