/**
 * 图解
 * @module aocudeo/lib/diagram
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */
declare module './diagram';
import { Organizer } from './organizer';
import type { Id, MapObj } from './types';

export class Diagram {
	constructor(
		private idList: Id[],
		private edgeMap: MapObj<Id[]>,
	) { }
	private dotLine(a: Id, b: Id, sign?: boolean, space = 1) {
		return [
			'\t'.repeat(space),
			`"${a.toString()}" -> "${b.toString()}"`,
			// (this.postJudgerSign[a] === Organizer.EXIST || this.preJudgerSign[b] === Organizer.EXIST) && ' [style = dashed]',
		].join('');
	}
	private dotSignCache: Set<string> | null = null;
	private getDotSignPrune() {
		return this.dotSignCache || (this.dotSignCache = new Set([
			this.dotLine(Organizer.start, Organizer.end),
			this.idList
				.filter(id => id !== Organizer.end && id !== Organizer.start)
				.map((id) => {
					return [this.dotLine(id, Organizer.end), this.dotLine(Organizer.start, id)];
					// if (typeof id === 'symbol') return [this.dotLine(id, Organizer.end), this.dotLine(Organizer.start, id)];
					// switch (Organizer.getHookType(id)) {
					// 	case false: return [];
					// 	case 'Main': return [];
					// 	case 'Post': return this.dotLine(id, Organizer.end);
					// 	case 'Pre': return this.dotLine(Organizer.start, id);
					// }
				}),
		].flat(3)));
	}
	private dotCache: Set<string> | null = null;
	private getDotPrune() {
		return this.dotCache || (this.dotCache = new Set(
			this.idList
				.map(a => this.edgeMap[a]!.map(b => ({ a, b })))
				.flat()
				.filter(({ a, b }) => new Set([a, b, Organizer.end, Organizer.start]).size === 4)
				.map(({ a, b }) => this.dotLine(a, b))
		));
	}
	/**
	 * 获取当前模块依赖关系的 DOT 图
	 * @param sign 是否显示起点和终点
	 */
	getDot(sign?: boolean) {
		return [
			'digraph loader {',
			...this.getDotPrune(),
			...(sign ? this.getDotSignPrune() : []),
			'}',
		].join('\n');
	}
	/**
	 * 获取图的链接
	 * @param sign 是否显示起点和终点
	 */
	getUrl(sign?: boolean) {
		return `http://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(this.getDot(sign))}`;
	}
}
