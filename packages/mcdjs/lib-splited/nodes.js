"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpression = exports.ExpressionXnor = exports.ExpressionXor = exports.ExpressionNor = exports.ExpressionNand = exports.ExpressionNot = exports.ExpressionOr = exports.ExpressionAnd = exports.Selector = exports.CommandRslt = exports.NameSpace = exports.CBGroup = exports.Branch = exports.Command = exports.CodeBlock = void 0;
/// <reference path="./exports.ts" />
require("reflect-metadata");
const errlib_1 = require("../lib/errlib");
const nodes_1 = require("../lib/magast/nodes");
const game_1 = require("../lib/types/game");
class CodeBlock extends nodes_1.Base {
    ntype = nodes_1.NType.CodeBlock;
    static 'zh-CN' = '代码块';
    constructor(operm, cbOri) {
        super(operm);
        const dadScope = operm.scope;
        operm.scope = this;
        cbOri();
        operm.scope = dadScope;
    }
    nodes = [];
}
exports.CodeBlock = CodeBlock;
__decorate([
    nodes_1.NodeAttr
], CodeBlock.prototype, "nodes", void 0);
class Command extends nodes_1.Base {
    exec;
    cond;
    ntype = nodes_1.NType.Command;
    static 'zh-CN' = '单命令';
    constructor(operm, exec, cond = false) {
        super(operm);
        this.exec = exec;
        this.cond = cond;
    }
}
exports.Command = Command;
class Branch extends nodes_1.Base {
    ntype = nodes_1.NType.Branch;
    static 'zh-CN' = '条件分支';
    constructor(operm, cond, tdoOri, fdoOri) {
        super(operm);
        this.cond = getExpression(operm, cond);
        this.tdo = new CodeBlock(operm, tdoOri);
        this.fdo = new CodeBlock(operm, fdoOri);
    }
    cond;
    tdo;
    fdo;
}
exports.Branch = Branch;
__decorate([
    nodes_1.NodeAttr
], Branch.prototype, "cond", void 0);
__decorate([
    nodes_1.NodeAttr
], Branch.prototype, "tdo", void 0);
__decorate([
    nodes_1.NodeAttr
], Branch.prototype, "fdo", void 0);
class CBGroup extends nodes_1.Base {
    repeat;
    tick;
    ntype = nodes_1.NType.CBGroup;
    static 'zh-CN' = '命令方块组';
    constructor(operm, repeat, tick) {
        super(operm);
        this.repeat = repeat;
        this.tick = tick;
    }
    cbs = [];
}
exports.CBGroup = CBGroup;
__decorate([
    nodes_1.NodeAttr
], CBGroup.prototype, "cbs", void 0);
class NameSpace extends nodes_1.Base {
    ntype = nodes_1.NType.NameSpace;
    static 'zh-CN' = '命名空间';
    constructor(operm, sign, content) {
        super(operm);
        this.sign = sign;
        this.content = new CodeBlock(operm, content);
    }
    sign;
    content;
}
exports.NameSpace = NameSpace;
__decorate([
    nodes_1.NodeAttr
], NameSpace.prototype, "content", void 0);
class CommandRslt extends nodes_1.Base {
    check;
    ntype = nodes_1.NType.CommandRslt;
    static 'zh-CN' = '命令条件';
    constructor(operm, check) {
        super(operm);
        this.check = check;
    }
}
exports.CommandRslt = CommandRslt;
class Selector extends nodes_1.Base {
    range;
    simData;
    ntype = nodes_1.NType.Selector;
    static 'zh-CN' = '选中的人';
    constructor(operm, range = '@e', simData) {
        super(operm);
        this.range = range;
        this.simData = simData;
    }
}
exports.Selector = Selector;
class BaseExpressionSig extends nodes_1.Base {
    constructor(operm, a) {
        super(operm);
        this.a = a;
    }
    a;
}
__decorate([
    nodes_1.NodeAttr
], BaseExpressionSig.prototype, "a", void 0);
class BaseExpressionBin extends nodes_1.Base {
    constructor(operm, a, b) {
        super(operm);
        this.a = a;
        this.b = b;
    }
    a;
    b;
}
__decorate([
    nodes_1.NodeAttr
], BaseExpressionBin.prototype, "a", void 0);
__decorate([
    nodes_1.NodeAttr
], BaseExpressionBin.prototype, "b", void 0);
class ExpressionAnd extends BaseExpressionBin {
    ntype = nodes_1.NType.ExpressionAnd;
    static 'zh-CN' = '与表达式';
}
exports.ExpressionAnd = ExpressionAnd;
class ExpressionOr extends BaseExpressionBin {
    ntype = nodes_1.NType.ExpressionOr;
    static 'zh-CN' = '或表达式';
}
exports.ExpressionOr = ExpressionOr;
class ExpressionNot extends BaseExpressionSig {
    ntype = nodes_1.NType.ExpressionNot;
    static 'zh-CN' = '非表达式';
}
exports.ExpressionNot = ExpressionNot;
class ExpressionNand extends BaseExpressionBin {
    ntype = nodes_1.NType.ExpressionNand;
    static 'zh-CN' = '与非表达式';
}
exports.ExpressionNand = ExpressionNand;
class ExpressionNor extends BaseExpressionBin {
    ntype = nodes_1.NType.ExpressionNor;
    static 'zh-CN' = '或非表达式';
}
exports.ExpressionNor = ExpressionNor;
class ExpressionXor extends BaseExpressionBin {
    ntype = nodes_1.NType.ExpressionXor;
    static 'zh-CN' = '异或表达式';
}
exports.ExpressionXor = ExpressionXor;
class ExpressionXnor extends BaseExpressionBin {
    ntype = nodes_1.NType.ExpressionXnor;
    static 'zh-CN' = '同或表达式';
}
exports.ExpressionXnor = ExpressionXnor;
const signCls = {
    and: ExpressionAnd,
    '&': ExpressionAnd,
    or: ExpressionOr,
    '|': ExpressionOr,
    not: ExpressionNot,
    '!': ExpressionNot,
    nand: ExpressionNand,
    nor: ExpressionNor,
    xor: ExpressionXor,
    xnor: ExpressionXnor,
};
function getExpression(operm, expr) {
    if (typeof expr === 'string')
        return new Selector(operm, expr);
    if ('tid' in expr)
        switch (expr.tid) {
            case game_1.TypeId.CommandRslt: return new CommandRslt(operm, expr.index);
            case game_1.TypeId.Selected: return getExpression(operm, expr.expr);
            case game_1.TypeId.SimTag: return new Selector(operm, void 0, expr);
        }
    if (expr.length === 2)
        return new signCls[expr[0]](operm, getExpression(operm, expr[1]));
    if (expr.length === 3)
        return new signCls[expr[1]](operm, getExpression(operm, expr[0]), getExpression(operm, expr[2]));
    return (0, errlib_1.throwErr)(errlib_1.EType.ErrIllegalParameter, Error(), expr);
}
exports.getExpression = getExpression;
//# sourceMappingURL=nodes.js.map