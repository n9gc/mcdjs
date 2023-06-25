import { PositionMap, SignChecker } from '../';

const sc = new SignChecker<void>();
const pm = new PositionMap(sc);

pm.insert('hh1', {});
pm.insert('pre:hh2', {});
pm.insert('hh2', 'hh1');
pm.insert('hh3', { preOf: 'hh1' });
console.dir(pm, { depth: 10 });

