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
exports.getVersion = void 0;
require("mcdjs");
const path = __importStar(require("path"));
const hfile_1 = __importStar(require("./hfile"));
function getVersion() {
    const pinfo = path.join(require.resolve('mcdjs'), '../../package.json');
    return require(pinfo).version;
}
exports.getVersion = getVersion;
async function handle() {
    const input = process.argv.at(-2);
    const outfile = process.argv.at(-1);
    if (process.argv.length < 3) {
        return console.log(`Version Info: ${getVersion()}`);
    }
    const infos = new hfile_1.RunInfos([input], outfile);
    await (0, hfile_1.out)(infos, await (0, hfile_1.default)(infos));
    process.exit(0);
}
exports.default = handle;
//# sourceMappingURL=index.js.map