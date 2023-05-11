/// <reference types="../../global" />
{
	const rslt = Command.say('hh');

	const sucRslt = When(rslt, () => {
		Command.say('success!');
	});

	When(sucRslt).Then(() => {
		Command.say('success, again!');
	});
}
