/**
 * 命令转命令方块插件
 * @module mcdjs/lib/plugin/internal-cmd2cb
 * @version 0.1.12
 * @license GPL-2.0-or-later
 */
declare module './internal-cmd2cb';

import { organizer } from ".";

organizer.addWorker(
	'internal-cmd2cb',
	async ({ data: operm }) => {
		operm.walk({
			CodeBlock(path) {
				if (path.sureDad(1)) path.dadKey;
				console.log(path.node);
			},
		});
	}
);
