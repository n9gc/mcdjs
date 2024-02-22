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
exports.noteMPText = exports.noteLog = void 0;
const game_1 = require("../types/game");
const formatters_1 = require("./formatters");
const noters = __importStar(require("./noters"));
function getNoter({ noter, formatter }) {
    if (typeof noter === 'function')
        return noter;
    if (typeof formatter === 'function')
        return noteMPText;
    return noters[`note${noter ?? formatter ?? 'MPText'}`];
}
exports.default = getNoter;
function noteLog(note) {
    return (0, formatters_1.formatMPText)({
        note: 'Info',
        cbType: game_1.CbType.Impulse,
        command: `say ${note}`,
        delay: 0,
        conditional: false,
        redstone: null,
    });
}
exports.noteLog = noteLog;
function noteMPText(note) {
    return `# ${note}\n`;
}
exports.noteMPText = noteMPText;
//# sourceMappingURL=noters.js.map