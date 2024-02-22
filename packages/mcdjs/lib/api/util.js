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
const base_1 = require("../types/base");
const static_1 = __importDefault(require("./static"));
var Export = appinf_1.globalify.Export;
class clsUtil extends static_1.default {
    opering;
    constructor(opering) {
        super();
        this.opering = opering;
    }
    tipLast = [];
    /**提供一个注释 */
    tip(...args) {
        this.tipLast.push(base_1.Template.join(...args));
    }
    getTip() {
        const tip = this.tipLast;
        this.tipLast = [];
        return tip.join('\n');
    }
    ;
}
exports.default = clsUtil;
__decorate([
    Export
], clsUtil.prototype, "tip", null);
//# sourceMappingURL=util.js.map