/**
 * 命令集模块
 * @module mcdjs/lib/api/cmdobj
 * @version 0.2.1
 * @license GPL-2.0-or-later
 */
declare module './cmdobj';
import type { Operator } from "../magast";
import type { CommandRsltClass } from "./static";
import clsUtil from "./util";
export default class clsCmdobj extends clsUtil {
    Command: {
        say: (text: string) => CommandRsltClass;
        tag: <T extends keyof {
            add: [name: string];
            remove: [name: string];
            list: [];
        }>(targets: string, method: T, ...args: {
            add: [name: string];
            remove: [name: string];
            list: [];
        }[T]) => CommandRsltClass;
    };
}
export declare function getCmdobj(opering: Operator): {
    say: (text: string) => CommandRsltClass;
    tag: <T extends keyof {
        add: [name: string];
        remove: [name: string];
        list: [];
    }>(targets: string, method: T, ...args: {
        add: [name: string];
        remove: [name: string];
        list: [];
    }[T]) => CommandRsltClass;
};
