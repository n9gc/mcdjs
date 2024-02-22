"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.select = exports.xnor = exports.xor = exports.nor = exports.nand = exports.not = exports.or = exports.and = exports.XNOR = exports.XOR = exports.NOR = exports.NAND = exports.NOT = exports.OR = exports.AND = exports.Tag = exports.tagExist = exports.SelectedClass = exports.CommandRsltClass = void 0;
const appinf_1 = require("../appinf");
const errlib_1 = require("../errlib");
const game_1 = require("../types/game");
const me = __importStar(require("./static"));
const noExportList = [];
function noExport(name) {
    noExportList.push(name);
}
noExport('default');
function clsStatic() { }
clsStatic.prototype = me;
exports.default = clsStatic;
class CommandRsltClass {
    index;
    constructor(index) {
        this.index = index;
    }
    tid = game_1.TypeId.CommandRslt;
}
exports.CommandRsltClass = CommandRsltClass;
class SelectedClass {
    expr;
    constructor(expr) {
        this.expr = expr;
    }
    tid = game_1.TypeId.Selected;
}
exports.SelectedClass = SelectedClass;
noExport('tagExist');
exports.tagExist = {};
/**标签实体 */
class Tag {
    name;
    constructor(name = 'ranTag' + Math.floor(Math.random() * 999999)) {
        this.name = name;
        while (name in exports.tagExist)
            name += '_';
        exports.tagExist[name] = true;
    }
    tid = game_1.TypeId.SimTag;
    toString() {
        return this.name;
    }
}
exports.Tag = Tag;
exports.AND = 'and';
exports.OR = 'or';
exports.NOT = 'not';
exports.NAND = 'nand';
exports.NOR = 'nor';
exports.XOR = 'xor';
exports.XNOR = 'xnor';
function binCalcsFn(sign, exprs) {
    if (!exprs.length)
        return (0, errlib_1.throwErr)(errlib_1.EType.ErrIllegalParameter, Error(), exprs);
    let sub = exprs.shift();
    exprs.forEach(n => sub = [sub, sign, n]);
    return sub;
}
function and(...expr) { return binCalcsFn(exports.AND, expr); }
exports.and = and;
function or(...expr) { return binCalcsFn(exports.OR, expr); }
exports.or = or;
function not(expr) { return [exports.NOT, expr]; }
exports.not = not;
function nand(...expr) { return binCalcsFn(exports.NAND, expr); }
exports.nand = nand;
function nor(...expr) { return binCalcsFn(exports.NOR, expr); }
exports.nor = nor;
function xor(...expr) { return binCalcsFn(exports.XOR, expr); }
exports.xor = xor;
function xnor(...expr) { return binCalcsFn(exports.XNOR, expr); }
exports.xnor = xnor;
/**有条件地选择实体 */
function select(expr, range) {
    if (range)
        expr = and(expr, range);
    return new SelectedClass(expr);
}
exports.select = select;
Object.keys(me)
    .filter(key => !noExportList.includes(key))
    .forEach(key => appinf_1.globalify.Export(me, key));
//# sourceMappingURL=static.js.map