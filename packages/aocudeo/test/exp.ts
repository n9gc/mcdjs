import test from 'tape';
import os from '..';
import oa from '../async';
import { OrganizerAsync, OrganizerSync } from '../lib/organizer';

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
