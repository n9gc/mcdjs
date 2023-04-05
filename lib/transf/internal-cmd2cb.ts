/**
 * 命令转命令方块插件
 * @module mcdjs/lib/transf/internal-cmd2cb
 * @version 0.1.1
 * @license GPL-3.0-or-later
 */
declare module './internal-cmd2cb';

import { TransfModule } from './types';
import { Types } from '../alload';
import { NType } from '../genast';

const mod: TransfModule = {
	'Command'(path) {
		path.replace(path.getNode(NType.Block, Object.assign(path.node, {
			cbtype: Types.CbType.Chain,
			con: false,
		})));
	}
};
export default mod;
