/**
 * 命令集模块
 * @module mcdjs/lib/command
 * @version 0.11.0
 * @license GPL-3.0-or-later
 */
declare module '.';

import out from '../glodef';
import { tAdd, tDel } from '../mcdtemp';

tAdd();

import './def';
import './lib';
export const Command = out('Command', McdTemp.Cmd);
export const chCommand = out('chCommand', McdTemp.Chc);

tDel();
