namespace Command {
    export function say(text: string) {
        const cmd = `say ${text}`;
        chCommand.push(cmd);
    }
}
McdJS.cmer(Command);
