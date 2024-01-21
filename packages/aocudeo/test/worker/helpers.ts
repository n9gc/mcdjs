import type { Id } from "../../lib/types";
import {
	WorkerAsyncFunction,
	WorkerContext,
	WorkerFunction,
	WorkerManager,
	WorkerRunner,
} from "../../lib/worker";

/**@borrows {@link WorkerManager} 异步 */
export class Twma<T, F extends WorkerAsyncFunction<T> = WorkerAsyncFunction<T>> extends WorkerManager<T, F> {
	get = () => ({
		/** workerMap */
		wm: this.workerMap,
	});
}
/**@borrows {@link WorkerManager} 同步 */
export class Twm<T> extends Twma<T, WorkerFunction<T>> { }

/**@borrows {@link WorkerRunner} */
class Twr<T, F extends WorkerAsyncFunction<T>> extends WorkerRunner<T, F> {
	get = () => ({
		/** workerMap */
		wm: this.workerMap,
		mc: (id: Id) => new WorkerContext(id, this),
	});
}
/**@borrows {@link WorkerRunner} 异步 */
export class Twra<T> extends Twr<T, WorkerAsyncFunction<T>> { }
/**@borrows {@link WorkerRunner} 同步 */
export class Twrs<T> extends Twr<T, WorkerFunction<T>> { }
