/**
 * 清理目录
 * @version 1.2.0
 * @license GPL-2.0-or-later
 */
declare module './clear';
export default function def(ignores?: string[], patterns?: (string | RegExp)[]): Promise<any>;
