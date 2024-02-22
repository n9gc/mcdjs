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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lethal_build_1 = __importDefault(require("lethal-build"));
const path = __importStar(require("path"));
const checkrun_1 = __importDefault(require("../tool/checkrun"));
const lb = (0, lethal_build_1.default)(path.resolve());
const { dir, snake, dels, goodReg, timeEnd, time, log, ignoreList, } = lb;
function def(ignores = [], patterns = []) {
    lb.ignoreList = [...ignores, ...ignoreList];
    const tempReg = RegExp(`${goodReg(dir + path.sep)}.*(\\.d\\.ts|\\.js|\\.js\\.map)$`);
    return snake(dels(lb.match([...patterns, tempReg])), timeEnd(), log('Clear successfully in', time(), 'ms'));
}
exports.default = def;
(0, checkrun_1.default)(def);
//# sourceMappingURL=clear.js.map