/// <reference types="mcdjs/global" />

const tagA = new Tag();
const tagB = new Tag();
const tagAlready = new Tag('hh');
const AllEntity = select([tagA, AND, [[NOT, tagAlready], OR, tagB]], '@e');

If(AllEntity, () => {
	Command.say('some entity');
}, () => {
	Command.say('nobody.')
});