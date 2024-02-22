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
exports.getCmdobj = void 0;
const appinf_1 = require("../appinf");
const util_1 = __importDefault(require("./util"));
var Export = appinf_1.globalify.Export;
class clsCmdobj extends util_1.default {
    Command = getCmdobj(this.opering);
}
exports.default = clsCmdobj;
__decorate([
    Export
], clsCmdobj.prototype, "Command", void 0);
function getCmdobj(opering) {
    function insert(cmd) {
        const cmdObj = opering.getNode('Command', cmd);
        return opering.push(cmdObj);
    }
    function say(text) {
        const cmd = `say ${text}`;
        return insert(cmd);
    }
    function tag(targets, method, arg = '') {
        const cmd = `tag ${targets} ${method} ${arg}`;
        return insert(cmd);
    }
    return {
        say,
        tag,
    };
}
exports.getCmdobj = getCmdobj;
//# sourceMappingURL=cmdobj.js.map