/**
 * 批量测试
 * @version 1.4.1
 * @license GPL-2.0-or-later
 */
declare module './all';
import 'promise-snake';
export interface Option {
    ignoreError?: boolean;
}
export default function def(fileList: string[], { ignoreError }?: Option): Promise<void>;
