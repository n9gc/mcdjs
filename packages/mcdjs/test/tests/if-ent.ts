import '../../global';

If('@e', () => {
	Command.say('some entity');
}, () => {
	Command.say('nobody.');
});
