/**
 * 测试导入
 * @version 1.2.2
 * @license GPL-2.0-or-later
 */
declare module './import';
import tester = require('export-tester');
export default function def(file: string | string[], cfg?: Parameters<typeof tester>[0]['cfg'], opt?: Parameters<typeof tester>[0]): Promise<void>;
