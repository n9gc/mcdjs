/**
 * 命令转命令方块插件
 * @module mcdjs/lib/transf/internal-cmd2cb
 * @version 0.1.2
 * @license GPL-3.0-or-later
 */
declare module './internal-cmd2cb';

import { Types } from '../alload';
import { NType } from '../magast/nodes';
import { TransfModule } from './types';

const mod: TransfModule = {
	'Command'(path) {
		path.replace(path.getNode(NType.Block, Object.assign(path.node, {
			cbtype: Types.CbType.Chain,
			con: false,
		})));
	}
};
export default mod;