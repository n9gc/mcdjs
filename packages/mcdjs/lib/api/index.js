"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammer_1 = __importDefault(require("./grammer"));
function getApi(opering) {
    return new grammer_1.default(opering);
}
exports.default = getApi;
//# sourceMappingURL=index.js.map