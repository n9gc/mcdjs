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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("../magast/nodes");
const game_1 = require("../types/game");
const formatters_1 = __importDefault(require("./formatters"));
const groupers_1 = __importDefault(require("./groupers"));
const noters_1 = __importDefault(require("./noters"));
async function generate(ast, option) {
    const formatter = (0, formatters_1.default)(option);
    const noter = (0, noters_1.default)(option);
    const grouper = (0, groupers_1.default)(option);
    const texts = [];
    ast.nodes.map(node => {
        if (node.ntype !== nodes_1.NType.CBGroup)
            return;
        texts.push(grouper());
        if (node.tips)
            texts.push(noter(node.tips));
        let cbTypeFirst = node.repeat ? game_1.CbType.Repeat : game_1.CbType.Impulse;
        texts.push(...node.cbs.map((cb, idx) => {
            if (cb.ntype !== nodes_1.NType.Command)
                return '';
            return formatter({
                cbType: idx ? game_1.CbType.Chain : cbTypeFirst,
                command: cb.exec,
                conditional: cb.cond,
                delay: idx ? node.tick : 0,
                note: cb.tips ?? '',
                redstone: false,
            });
        }));
    });
    return {
        text: (await Promise.all(texts)).join(''),
        ast,
        tips: ast.tips,
        option,
    };
}
exports.default = generate;
__exportStar(require("./genevents"), exports);
//# sourceMappingURL=index.js.map