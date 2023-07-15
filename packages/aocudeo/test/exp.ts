import test from 'tape';
import { OrganizerSync, OrganizerAsync } from '../lib/organizer';
import os from '..';
import oa from '../async';

test('##默认导出', t => {
	t.equal(
		os,
		OrganizerSync,
		'索引导出正确'
	);
	t.equal(
		oa,
		OrganizerAsync,
		'异步导出正确'
	);
	t.end();
});
