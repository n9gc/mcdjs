import { PositionMap, SignChecker } from '../';

const npm = () => new PositionMap(new SignChecker<void>());
const log = <T>(n: T) => console.dir(n, { depth: 10 });

{
	const pm = npm();
	pm.insert('hh1', {});
	log(pm);
}

{
	const pm = npm();
	pm.insert('hh1', {});
	pm.insert('hh2', 'hh1');
	log(pm);
}

{
	const pm = npm();
	pm.insert('hh1', {});
	pm.insert('hh2', 'hh1');
	pm.insert('pre:hh2', {});
	log(pm);
}

{
	const pm = npm();
	pm.insert('hh1', {});
	pm.insert('pre:hh2', {});
	pm.insert('hh2', 'hh1');
	log(pm);
}

{
	const pm = npm();
	pm.insert('hh1', {});
	pm.insert('hh3', { preOf: 'hh1' });
	log(pm);
}

{
	const pm = npm();
	pm.insert('hh1', {});
	pm.insert('pre:pre:hh2', {});
	log(pm);
}

{
	const pm = npm();
	pm.insert('hh1', {});
	pm.insert('hh4', { preOf: 'pre:pre:hh1' })
	log(pm);
}

{
	const pm = npm();
	pm.insert('hh4', { preOf: 'pre:pre:hh1' })
	pm.insert('hh1', {});
	log(pm);
}

{
	const pm = npm();
	pm.insert('hh4', { preOf: 'pre:pre:hh1' })
	log(pm);
}

