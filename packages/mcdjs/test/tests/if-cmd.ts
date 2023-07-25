import '../../global';

const say2 = Command.say('8&fh0');

tip`test if say2 ran successfully`;
If(say2, () => {
	Command.say('Success!');
}, () => {
	Command.say('Failed!');
});
