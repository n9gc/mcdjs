/// <reference types="../../global" />
{
	const AllEntity = select('@e');
	If(AllEntity, () => {
		Command.say('some entity');
	}, () => {
		Command.say('nobody.');
	});
}
