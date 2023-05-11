/// <reference types="../../global" />
{
	const tagA = new Tag();
	const tagB = new Tag();
	const tagAlready = new Tag('hh');
	const AllEntity = select([
		tagA, AND, [
			and(
				not(tagAlready),
				tagB,
				tagA,
			), OR, tagB
		]
	], '@e');

	If(AllEntity, () => {
		Command.say('some entity');
	}, () => {
		Command.say('nobody.');
	});
}
