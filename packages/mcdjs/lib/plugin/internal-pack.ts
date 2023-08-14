/**
 * 打包裸命令
 * @module mcdjs/lib/plugin/internal-pack
 * @version 0.2.1
 * @license GPL-2.0-or-later
 */
declare module './internal-pack';

import { organizer } from ".";
import { NType, Node } from "../magast/nodes";
import { guard } from "../magast/util";

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