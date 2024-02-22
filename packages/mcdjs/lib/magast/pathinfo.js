"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const errlib_1 = require("../errlib");
const metcls_1 = __importDefault(require("./metcls"));
const transf_1 = require("./transf");
const util_1 = require("./util");
class PathInfo extends metcls_1.default {
    node;
    dad;
    inList;
    listIndex;
    constructor(operm, node, dad, inList, listIndex, dadKey) {
        super();
        this.node = node;
        this.dad = dad;
        this.inList = inList;
        this.listIndex = listIndex;
        this.operm = operm;
        this.dadKey = dadKey;
        this.listIn = inList ? dad[dadKey] : null;
    }
    operm;
    dadKey;
    listIn;
    isInList() {
        return this.inList;
    }
    isNotInList() {
        return this.inList;
    }
    sure(ntype) {
        return ntype === this.node.ntype;
    }
    notSure(ntype) {
        return ntype !== this.node.ntype;
    }
    sureDad(ntype) {
        return ntype === this.dad?.ntype;
    }
    notSureDad(ntype) {
        return ntype === this.dad?.ntype;
    }
    removed = false;
    remove() {
        if (!this.inList)
            (0, errlib_1.throwErr)(errlib_1.EType.ErrNotInList, Error(), this);
        if (this.removed)
            return;
        const list = this.dad[this.dadKey];
        list.splice(list.indexOf(this.node), 1);
    }
    walkEmiter(emiter) {
        try {
            emiter.entry(this);
            for (const attrName of Reflect.getMetadata('nodeAttr', this.node) || []) {
                let attr = this.node[attrName];
                let idx, inList = true;
                if (!('length' in attr))
                    attr = [attr], inList = false;
                else
                    attr = attr.slice(0);
                for (idx = 0; idx < attr.length; ++idx)
                    new PathInfo(this.operm, attr[idx], this.node, inList, idx, attrName).walkEmiter(emiter);
            }
            emiter.exit(this);
        }
        catch (err) {
            util_1.TransfError.assert(err);
            switch (err?.cause?.signal) {
                case util_1.TransfSignal.Stop: return;
                default: (0, errlib_1.throwErr)(errlib_1.EType.ErrWrongTransfErrorSignal, err, err);
            }
        }
    }
    walk(emiter) {
        this.walkEmiter(new transf_1.PluginEmiter(emiter));
    }
    stop() {
        throw new util_1.TransfError(util_1.TransfSignal.Stop);
    }
}
exports.default = PathInfo;
//# sourceMappingURL=pathinfo.js.map