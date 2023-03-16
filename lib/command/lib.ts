/**
 * 命令集通用库
 * @version 0.1.1
 * @license GPL-3.0-or-later
 */
void 0;

namespace Command {
    McdJS.cmer(Command);
    export namespace Ver {
        export const lib = '0.1.1';
    }
    export function say(text: string) {
        const cmd = `say ${text}`;
        const parser = chCommand.parserNow;
        parser.push(cmd);
    }
}
