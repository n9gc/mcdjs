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
exports.formatMPText = void 0;
const game_1 = require("../types/game");
const formatters = __importStar(require("./formatters"));
function getFormatter({ formatter }) {
    return typeof formatter === 'function' ? formatter : formatters[`format${formatter ?? 'MPText'}`];
}
exports.default = getFormatter;
function formatMPText({ note, cbType, command, delay, conditional, redstone, }) {
    return [
        `[${[
            formatMPText.getRedstone(redstone),
            formatMPText.getCbType(cbType),
            formatMPText.getConditional(conditional),
            formatMPText.getDelay(delay),
        ]}]`,
        command,
        note && `// ${note}`,
    ].filter(n => n).join(' ') + '\n';
}
exports.formatMPText = formatMPText;
(function (formatMPText) {
    function getRedstone(redstone) {
        return redstone === null ? '~' : redstone ? '-' : '+';
    }
    formatMPText.getRedstone = getRedstone;
    function getCbType(cbType) {
        switch (cbType) {
            case game_1.CbType.Chain: return 'L';
            case game_1.CbType.Impulse: return 'M';
            case game_1.CbType.Repeat: return 'X';
            default: return '~';
        }
    }
    formatMPText.getCbType = getCbType;
    function getConditional(conditional) {
        return conditional === null ? '~' : conditional ? '+' : '-';
    }
    formatMPText.getConditional = getConditional;
    function getDelay(delay) {
        return delay ?? '~';
    }
    formatMPText.getDelay = getDelay;
})(formatMPText || (exports.formatMPText = formatMPText = {}));
//# sourceMappingURL=formatters.js.map