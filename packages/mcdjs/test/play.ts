/// <reference path="../global.ts" />
import * as mcdjs from '..';

mcdjs.appinf.globalify();
mcdjs.appinf.parse('play', () => {
	Command.say('hh');
}).then(ast => {
	console.dir(ast, { depth: 10 });
});
