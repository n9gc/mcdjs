/**
 * 命令转命令方块插件
 * @module mcdjs/lib/transf/internal-cmd2cb
 * @version 0.1.6
 * @license GPL-3.0-or-later
 */
declare module './internal-cmd2cb';

import { NType } from '@mcdjs/base/dist/types/nodes';
import { CbType } from '@mcdjs/types/game';
import { TransfModule } from './types';

const mod: TransfModule = {
	'Command'(path) {
		path.replace(path.getNode(NType.Block, Object.assign(path.node, {
			cbtype: CbType.Chain,
			con: false,
		})));
	}
};
export default mod;
