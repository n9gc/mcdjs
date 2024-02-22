"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = exports.tranumNType = exports.NType = exports.NodeAttr = exports.isNodeConstructor = exports.isNode = exports.Base = void 0;
require("reflect-metadata");
const text_1 = require("../config/text");
const errlib_1 = require("../errlib");
const gload_1 = require("../gload");
class Base {
    static nodeAttr = [];
    static langObj = '未知节点';
    constructor(operm, getTip = true) {
        this.index = operm.plusNodeNum();
        if (getTip) {
            const tips = operm.api.getTip();
            if (tips)
                this.tips = tips;
        }
    }
    index;
    tips;
}
exports.Base = Base;
function isNode(n) {
    return n instanceof Base;
}
exports.isNode = isNode;
function isNodeConstructor(nodeConstructor) {
    return typeof nodeConstructor === 'function' && isNode(nodeConstructor.prototype);
}
exports.isNodeConstructor = isNodeConstructor;
function NodeAttr(proto, key) {
    let nodeAttr;
    Reflect.hasMetadata('nodeAttr', proto)
        ? nodeAttr = Reflect.getMetadata('nodeAttr', proto)
        : Reflect.defineMetadata('nodeAttr', nodeAttr = [], proto);
    nodeAttr.push(key);
}
exports.NodeAttr = NodeAttr;
var Internal;
(function (Internal) {
    class Top extends Base {
        ntype = exports.NType.Top;
        static 'zh-CN' = '树顶空位';
        constructor(operm, system) {
            super(operm);
            this.system = system;
        }
        system;
    }
    __decorate([
        NodeAttr
    ], Top.prototype, "system", void 0);
    Internal.Top = Top;
    class System extends Base {
        tips;
        ntype = exports.NType.System;
        static 'zh-CN' = '指令系统';
        constructor(operm, tips) {
            super(operm);
            this.tips = tips;
        }
        nodes = [];
    }
    __decorate([
        NodeAttr
    ], System.prototype, "nodes", void 0);
    Internal.System = System;
})(Internal || (Internal = {}));
exports.NType = {};
// export type GotSelNode<T extends NType = NType> = Exclude<Node<T>, 'index'>;
exports.tranumNType = (0, text_1.regEnum)('NType', exports.NType);
let nodeCount = 0;
gload_1.Port.Node = new Proxy(Internal, {
    set(Nodes, nodeName, nodeConstructor) {
        if (!isNodeConstructor(nodeConstructor))
            (0, errlib_1.throwErr)(errlib_1.EType.ErrIllegalParameter, Error('应为构造函数'), [nodeConstructor]);
        Nodes[nodeName] = nodeConstructor;
        exports.NType[exports.NType[nodeName] = nodeCount] = nodeName;
        exports.tranumNType.addTranObj({ [nodeName]: nodeConstructor.langObj });
        nodeCount++;
        return true;
    }
});
Object.assign(gload_1.Port.Node, Internal);
exports.Node = McdJSPort.Node;
//# sourceMappingURL=nodes.js.map