/// <reference types="node" />
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
import { NType } from "../magast/nodes";
export type GeneventWhen = 'entry' | 'exit' | 'all';
export declare const geneventEmtier: Event;
export declare function regGenevent<N extends NType>(...info: [ntype: N, when: GeneventWhen][]): {
    ntypes: N[];
};
declare namespace Internal {
    const Start: {
        ntypes: 15[];
    };
    const End: {
        ntypes: 15[];
    };
}
export {};
