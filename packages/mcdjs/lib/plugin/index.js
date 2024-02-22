"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizer = void 0;
const async_1 = __importDefault(require("aocudeo/async"));
exports.organizer = new async_1.default();
async function default_1(operm) {
    await exports.organizer.execute(operm);
    return operm;
}
exports.default = default_1;
//# sourceMappingURL=index.js.map