import test from 'tape';
import { Organizer } from '../..';

test('##钩子标识工具类', t => {
	t.equal(
		Organizer.affixMain,
		'main:',
		'正常获取标识'
	);
	Organizer.affixMain = 'hh';
	Organizer.affixPre = 'l#';
	Organizer.affixPost = '45';
	t.equal(
		Organizer.affixMain,
		'hh',
		'正常重设标识'
	);
	t.deepEqual(
		Organizer.affixs,
		['l#', 'hh', '45'],
		'标识数组'
	);
	t.equal(
		Organizer.getHookType('hh123'),
		'Main',
		'标识类型'
	);
	t.equal(
		Organizer.getHookedOf('45123'),
		'123',
		'标识的钩子',
	);
	t.deepEqual(
		Organizer.getAffixed('hh'),
		{ preId: 'l#hh', mainId: 'hhhh', postId: '45hh' },
		'标识组合'
	);
	Organizer.affixMain = 'main:';
	Organizer.affixPre = 'pre:';
	Organizer.affixPost = 'post:';
	t.end();
});

