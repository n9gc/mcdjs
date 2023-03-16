/**
 * 命令集通用库
 * @license GPL-3.0-or-later
 */
void 0;

namespace Command {
    McdJS.cmer(Command);
    export namespace Ver {
        export const lib = '0.1.0';
    }
    export function say(text: string) {
        const cmd = `say ${text}`;
        chCommand.push(cmd);
    }
}
