/**
 * 命令转命令方块插件
 * @module mcdjs/lib/plugin/internal-cmd2cb
 * @version 0.1.13
 * @license GPL-2.0-or-later
 */
declare module './internal-pack';

import { organizer } from ".";

organizer.addWorker(
	'internal-pack',
	async ({ data: operm }) => {
		operm.walk({
			all(path) {
				if (path.sureDad(1)) path.dadKey;
				console.log(path.node);
			},
		});
	}
);
