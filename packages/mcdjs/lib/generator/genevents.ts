/**
 * 生成事件
 * @module mcdjs/lib/generator/genevents
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './genevents';
declare global {
	namespace McdJSPort {
		namespace genevents {
			export import Start = Internal.Start;
			export import End = Internal.End;
		}
	}
}

import Event from 'events';
import { Port } from "../gload";
import { NType } from "../magast/nodes";
import { organizer } from "../plugin";
import { InitializableMap } from '../types/base';

export type GeneventWhen = 'entry' | 'exit' | 'all';
interface GeneventGroup {
	entry: string[];
	exit: string[];
}
class GeneventGroupMap<K> extends InitializableMap<K, GeneventGroup> {
	protected initializeValue(): GeneventGroup {
		return { entry: [], exit: [] };
	}
}
const geneventMap = new GeneventGroupMap<NType>();
export const geneventEmtier = new Event();
export function regGenevent<N extends NType>(...info: [ntype: N, when: GeneventWhen][]) {
	const name = Object.keys(Port.genevents).at(-1)!;
	const ntypes: N[] = [];
	info.forEach(([ntype, when]) => {
		const group = geneventMap.forceGet(ntype);
		if (when === 'all' || when === 'entry') group.entry.push(name);
		if (when === 'all' || when === 'exit') group.exit.push(name);
		ntypes.push(ntype);
	});
	return { ntypes };
}

namespace Internal {
	export const Start = regGenevent(
		[NType.System, 'entry'],
	);
	export const End = regGenevent(
		[NType.System, 'exit'],
	);
}

organizer.addWorker(
	'internal-pack',
	async ({ data: operm }) => {
		operm.walk({
			all: {
				entry(path) {
					geneventMap.get(path.node.ntype)?.entry.forEach(name => geneventEmtier.emit(name));
				},
				exit(path) {
					geneventMap.get(path.node.ntype)?.exit.forEach(name => geneventEmtier.emit(name));
				}
			}
		});
	}
);
