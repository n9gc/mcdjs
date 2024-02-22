"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appinf_1 = require("../appinf");
const cmdobj_1 = __importDefault(require("./cmdobj"));
var Export = appinf_1.globalify.Export;
class clsGrammer extends cmdobj_1.default {
    // export class NameSpace {
    // 	constructor(sign: string, content: Vcb) {
    // 		const opering = chCommand.getOperm();
    // 		this.node = opering.getNode('NameSpace', sign, content);
    // 	}
    // 	protected readonly node;
    // }
    /**开启一个分支结构 */
    If(expr, tdo, fdo = (() => { })) {
        const branch = this.opering.getNode('Branch', expr, tdo, fdo);
        return this.opering.push(branch);
    }
}
exports.default = clsGrammer;
__decorate([
    Export
], clsGrammer.prototype, "If", null);
//# sourceMappingURL=grammer.js.map