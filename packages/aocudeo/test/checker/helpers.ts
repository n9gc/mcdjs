import { SignChecker } from '../../lib/checker';
import type { Id } from '../../lib/types';

import { Organizer } from '../../lib/organizer';

/**用于调试的 {@link SignChecker} */
export class Tsc<I extends Id> extends SignChecker<I> {
	/**添加了{@link Organizer.start|开头标记}和{@link Organizer.end|结束标记}的 {@link Tsc} */
	static idv = class extends Tsc<Id> {
		constructor() {
			super();
			this.ensureds.add(Organizer.start).add(Organizer.end);
		}
	};
	get = () => ({
		/** ensureds */
		en: this.ensureds,
		/** requireds */
		re: this.requireds,
	});
}
