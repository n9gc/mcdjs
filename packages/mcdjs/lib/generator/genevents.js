"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regGenevent = exports.geneventEmtier = void 0;
const events_1 = __importDefault(require("events"));
const gload_1 = require("../gload");
const nodes_1 = require("../magast/nodes");
const plugin_1 = require("../plugin");
const base_1 = require("../types/base");
class GeneventGroupMap extends base_1.InitializableMap {
    initializeValue() {
        return { entry: [], exit: [] };
    }
}
const geneventMap = new GeneventGroupMap();
exports.geneventEmtier = new events_1.default();
function regGenevent(...info) {
    const name = Object.keys(gload_1.Port.genevents).at(-1);
    const ntypes = [];
    info.forEach(([ntype, when]) => {
        const group = geneventMap.forceGet(ntype);
        if (when === 'all' || when === 'entry')
            group.entry.push(name);
        if (when === 'all' || when === 'exit')
            group.exit.push(name);
        ntypes.push(ntype);
    });
    return { ntypes };
}
exports.regGenevent = regGenevent;
var Internal;
(function (Internal) {
    Internal.Start = regGenevent([nodes_1.NType.System, 'entry']);
    Internal.End = regGenevent([nodes_1.NType.System, 'exit']);
})(Internal || (Internal = {}));
plugin_1.organizer.addWorker('internal-pack', async ({ data: operm }) => {
    operm.walk({
        all: {
            entry(path) {
                geneventMap.get(path.node.ntype)?.entry.forEach(name => exports.geneventEmtier.emit(name));
            },
            exit(path) {
                geneventMap.get(path.node.ntype)?.exit.forEach(name => exports.geneventEmtier.emit(name));
            }
        }
    });
});
//# sourceMappingURL=genevents.js.map