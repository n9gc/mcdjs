"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginEmiter = exports.getNodesVisited = void 0;
const errlib_1 = require("../errlib");
const base_1 = require("../types/base");
const nodes_1 = require("./nodes");
const util_1 = require("./util");
var Alias;
(function (Alias) {
    function con(...n) {
        return n;
    }
    Alias.expressionCalcSig = con(nodes_1.NType.ExpressionNot);
    Alias.expressionCalcBin = con(nodes_1.NType.ExpressionAnd, nodes_1.NType.ExpressionNand, nodes_1.NType.ExpressionNor, nodes_1.NType.ExpressionOr, nodes_1.NType.ExpressionXnor, nodes_1.NType.ExpressionXor);
    Alias.expressionCalc = con(...Alias.expressionCalcBin, ...Alias.expressionCalcSig);
    Alias.expression = con(...Alias.expressionCalc, nodes_1.NType.Selector, nodes_1.NType.CommandRslt);
})(Alias || (Alias = {}));
const aliasList = (0, base_1.listKeyOf)(Alias);
function isAlias(n) {
    return aliasList.includes(n);
}
function getNodesVisited(name) {
    if (name === 'all')
        return base_1.Enum.valueOf(nodes_1.NType);
    if (base_1.Enum.isKeyOf(nodes_1.NType, name))
        return [nodes_1.NType[name]];
    if (isAlias(name))
        return Alias[name];
    return (0, errlib_1.throwErr)(errlib_1.EType.ErrIllegalVisitorName, Error(), name);
}
exports.getNodesVisited = getNodesVisited;
class PluginEmiter {
    static visitorType = ['exit', 'entry'];
    constructor(plugin) {
        if (!plugin)
            return;
        if ('addMap' in plugin)
            return plugin;
        else {
            for (const name in plugin) {
                const now = plugin[name];
                const obj = typeof now === 'function' ? { entry: now } : now;
                getNodesVisited(name).forEach(n => this.addMap(n, obj));
            }
        }
    }
    entryMap = new base_1.ArrayMap;
    exitMap = new base_1.ArrayMap;
    addMap(n, obj) {
        PluginEmiter.visitorType.forEach(key => obj[key] && this[`${key}Map`].push(n, obj[key]));
    }
    do(way, path) {
        this[`${way}Map`].get(path.node.ntype)?.forEach(fn => {
            try {
                fn(path);
            }
            catch (err) {
                util_1.TransfError.assert(err);
                switch (err.cause.signal) {
                    case util_1.TransfSignal.Next: return;
                }
            }
        });
    }
    entry(path) {
        this.do('entry', path);
    }
    exit(path) {
        this.do('exit', path);
    }
}
exports.PluginEmiter = PluginEmiter;
//# sourceMappingURL=transf.js.map