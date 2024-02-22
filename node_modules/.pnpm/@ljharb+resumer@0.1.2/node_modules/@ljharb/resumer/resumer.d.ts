import through = require('@ljharb/through');

declare function Resumer(
    write?: Parameters<typeof through>[0],
    end?: Parameters<typeof through>[1]
): ReturnType<typeof through>;

export = Resumer;