/// <reference path="../global.ts" />
import * as mcdjs from '..';

mcdjs.appinf.parse('play', () => {
	Command.say('hh');
}, { globalify: true }).then(ast => {
	console.dir(ast, { depth: 10 });
});
