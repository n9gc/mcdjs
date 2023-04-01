/// <reference types="mcdjs/global" />

const say2 = Command.say('8&fh0');

tip`test if say2 ran successfully`;
const ifRslt = If(say2).Then(() => {
	tip`log success`;
	Command.say('Success!');
}).Else(() => {
	Command.tag('@a', 'add', 'hh');
});

If(ifRslt, () => {
	Command.say('Success!');
}, () => {
	Command.say('Failed!');
});
