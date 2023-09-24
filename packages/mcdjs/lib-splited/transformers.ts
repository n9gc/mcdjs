/**
 * @module mcdjs/lib-splited/transformers
 * @version 0.0.1
 * @license GPL-2.0-or-later
 */
/// <reference path="./index.ts" />
declare module './transformers';

import { NType, Node } from "../lib/magast/nodes";
import { guard } from "../lib/magast/util";
import { organizer } from "../lib/plugin";

/**
 * 打包裸命令
 * @module internal-pack
 * @version 0.2.1
 * @license GPL-2.0-or-later
 */
organizer.addWorker(
	'internal-pack',
	async ({ data: operm }) => {
		const groupNow = new Node.CBGroup(operm, false, 0);
		operm.ast.nodes.push(groupNow);
		operm.walk({
			all(path) {
				guard(path.sureDad(NType.System) && path.notSure(NType.CBGroup));
				groupNow.cbs.push(path.node);
				path.remove();
			}
		});
		operm.walk({
			all(path) {
				guard(path.sure(NType.CBGroup));
				if (!path.node.cbs.length) path.remove();
			}
		});
	}
);

/**
 * 条件判断运算插件
 * @module internal-cond
 * @version 0.1.6
 * @license GPL-2.0-or-later
 */
organizer.addPosition('internal-cond', {
}, async ({ data: operm }) => {
});
