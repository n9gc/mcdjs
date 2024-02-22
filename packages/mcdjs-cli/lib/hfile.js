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
exports.out = exports.compile = exports.resolve = exports.assocList = exports.RunInfos = void 0;
const fs = __importStar(require("fs"));
const fsp = __importStar(require("fs/promises"));
const appinf_1 = require("mcdjs/lib/appinf");
const errlib_1 = require("mcdjs/lib/errlib");
const path = __importStar(require("path"));
require("promise-snake");
class RunInfos {
    inputs;
    outfile;
    constructor(inputs = [], outfile = '') {
        this.inputs = inputs;
        this.outfile = outfile;
    }
}
exports.RunInfos = RunInfos;
exports.assocList = [
    '',
    '.mcdjs',
    '.js',
    '.txt',
    '.mjs',
    '.cjs',
    '.ts',
    '.tsx',
    '.jsx',
];
function isExist(file) {
    return new Promise(res => fs.access(file, fs.constants.F_OK, err => res(!err)));
}
async function resolve({ inputs }) {
    const files = [];
    await Promise.snake(inputs
        .map(input => path.resolve(input))
        .map(file => path.extname(file) ? file : exports.assocList.map(ext => file + ext))
        .map(file => (res, rej) => typeof file === 'string'
        ? isExist(file).then(n => n ? (files.push(file), res()) : (0, errlib_1.trapErr)(rej, errlib_1.EType.ErrNoSuchFile, (0, errlib_1.getTracker)(), [file])())
        : Promise.snake(file.map(may => (res, rej) => isExist(may).then(n => n ? rej(may) : res()))).then((0, errlib_1.trapErr)(rej, errlib_1.EType.ErrNoSuchFile, (0, errlib_1.getTracker)(), file), (sure) => (files.push(sure), res())))).catch(errlib_1.errCatcher);
    return files;
}
exports.resolve = resolve;
async function compile(files) {
    const commands = [];
    await Promise.thens(files.map(file => async () => commands.push((await (0, appinf_1.parse)(file, () => Promise.resolve(`${file}`).then(s => __importStar(require(s))), { globalify: true })).text)));
    return commands;
}
exports.compile = compile;
async function resolveFile(file) {
    file = path.resolve(file);
    const dir = path.dirname(file);
    await fsp.mkdir(dir, { recursive: true });
    return file;
}
async function out(infos, commands) {
    await fsp.writeFile(await resolveFile(infos.outfile), JSON.stringify(commands, null, '  '));
}
exports.out = out;
async function run(infos) {
    const files = await resolve(infos);
    const commands = await compile(files);
    return commands;
}
exports.default = run;
//# sourceMappingURL=hfile.js.map