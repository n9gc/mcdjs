"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./index.ts" />
const nodes_1 = require("../lib/magast/nodes");
const util_1 = require("../lib/magast/util");
const plugin_1 = require("../lib/plugin");
/**
 * 打包裸命令
 * @module internal-pack
 * @version 0.2.1
 * @license GPL-2.0-or-later
 */
plugin_1.organizer.addWorker('internal-pack', async ({ data: operm }) => {
    const groupNow = new nodes_1.Node.CBGroup(operm, false, 0);
    operm.ast.nodes.push(groupNow);
    operm.walk({
        all(path) {
            (0, util_1.guard)(path.sureDad(nodes_1.NType.System) && path.notSure(nodes_1.NType.CBGroup));
            groupNow.cbs.push(path.node);
            path.remove();
        }
    });
    operm.walk({
        all(path) {
            (0, util_1.guard)(path.sure(nodes_1.NType.CBGroup));
            if (!path.node.cbs.length)
                path.remove();
        }
    });
});
/**
 * 条件判断运算插件
 * @module internal-cond
 * @version 0.1.6
 * @license GPL-2.0-or-later
 */
plugin_1.organizer.addPosition('internal-cond', {}, async ({ data: operm }) => {
});
//# sourceMappingURL=transformers.js.map