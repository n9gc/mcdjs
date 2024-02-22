"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("./nodes");
class Metcls {
    getNode(name, ...args) {
        const cls = nodes_1.Node[name];
        return new cls(this.operm, ...args);
    }
}
exports.default = Metcls;
//# sourceMappingURL=metcls.js.map