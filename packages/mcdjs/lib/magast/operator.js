"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const metcls_1 = __importDefault(require("./metcls"));
const nodes_1 = require("./nodes");
const pathinfo_1 = __importDefault(require("./pathinfo"));
const transf_1 = require("./transf");
const api_1 = __importDefault(require("../api"));
class Operator extends metcls_1.default {
    constructor(tips) {
        super();
        this.top = new nodes_1.Node.Top(this, this.scope = this.ast = new nodes_1.Node.System(this, tips));
    }
    operm = this;
    scope;
    ast;
    top;
    nodeNum = 0;
    api = (0, api_1.default)(this);
    plusNodeNum() {
        return this.nodeNum++;
    }
    push(node) {
        this.scope.nodes.push(node);
        return new this.api.CommandRsltClass(node.index);
    }
    walk(emiter) {
        new pathinfo_1.default(this, this.ast, this.top, false, 0, 'system').walk(emiter);
    }
    plugins = new transf_1.PluginEmiter();
}
exports.default = Operator;
//# sourceMappingURL=operator.js.map