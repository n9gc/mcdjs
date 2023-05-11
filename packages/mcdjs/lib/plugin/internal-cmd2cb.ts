/**
 * 命令转命令方块插件
 * @module mcdjs/lib/plugin/internal-cmd2cb
 * @version 0.1.10
 * @license GPL-3.0-or-later
 */
declare module './internal-cmd2cb';

import { origanizer } from ".";

origanizer.insert('internal-cmd2cb', {
}, async (operm) => {
	operm.walk({
		Command(path) {
			console.log(path.node.exec);
		},
	});
	return operm;
});
