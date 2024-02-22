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
const tester = require("export-tester");
const path = __importStar(require("path"));
const checkrun_1 = __importDefault(require("../tool/checkrun"));
const dirNow = path.resolve();
const tsc = {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "target": "ESNext",
    "skipLibCheck": true,
};
const skipKey = [
    'noImplicitAny',
    'strict',
];
const cmd = ['', ...Object.keys(tsc)].reduce((p, k) => 
//@ts-ignore
skipKey.includes(k) ? p : `${p} --${k} ${tsc[k] === true ? '' : tsc[k]}`);
async function def(file, cfg = {}, opt = {}) {
    const { err, detail } = await tester({
        disp: false,
        file: path.join(dirNow, ...(typeof file === 'string' ? [file] : file)),
        sign: 'cmd',
        cfg: { ...cfg, ts: { cmd, ...cfg?.ts } },
        ...opt,
    }, {
        import() {
            console.log(cmd);
        }
    });
    err && process.send?.(detail);
    process.exit(err);
}
exports.default = def;
(0, checkrun_1.default)(def);
//# sourceMappingURL=import.js.map