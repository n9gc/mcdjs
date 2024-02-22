/**
 * 图解
 * @module aocudeo/lib/diagram
 * @version 1.1.1
 * @license GPL-2.0-or-later
 */
declare module './diagram';
import type { Id, MapObj } from './types';
export declare class Diagram {
    private idList;
    private edgeMap;
    constructor(idList: Id[], edgeMap: MapObj<Id[]>);
    private dotLine;
    private dotSignCache;
    private getDotSignPrune;
    private dotCache;
    private getDotPrune;
    /**
     * 获取当前模块依赖关系的 DOT 图
     * @param sign 是否显示起点和终点
     */
    getDot(sign?: boolean): string;
    /**
     * 获取图的链接
     * @param sign 是否显示起点和终点
     */
    getUrl(sign?: boolean): string;
}
