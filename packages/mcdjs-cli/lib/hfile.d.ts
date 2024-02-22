/**
 * 文件解析处理模块
 * @module mcdjs-cli/lib/hfile
 * @version 1.1.3
 * @license GPL-2.0-or-later
 */
declare module './hfile';
import 'promise-snake';
export interface RoundParsed extends Array<string> {
}
export interface ParRunInfos extends Partial<RunInfos> {
}
export declare class RunInfos {
    inputs: string[];
    outfile: string;
    constructor(inputs?: string[], outfile?: string);
}
export declare const assocList: string[];
export declare function resolve({ inputs }: RunInfos): Promise<string[]>;
export declare function compile(files: string[]): Promise<RoundParsed>;
export declare function out(infos: RunInfos, commands: RoundParsed): Promise<void>;
export default function run(infos: RunInfos): Promise<RoundParsed>;
