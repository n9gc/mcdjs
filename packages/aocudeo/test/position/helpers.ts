import { PositionMap } from "../../lib/position";
import type { Hookable } from "../../lib/types";
import { Tsc } from "../checker/helpers";

/**用于调试的 {@link PositionMap} */
export class Tpm extends PositionMap {
	get = () => ({
		/** surePositionMap */
		spm: this.surePositionMap,
		/** splitedChecker */
		sc: this.splitedChecker,
		/** insertedChecker */
		ic: this.insertedChecker,
		/** countMap */
		cm: this.countMap,
		/** graphCache */
		gc: this.graphCache,
	});
	/** surePositionMap */
	override insertedChecker = new Tsc.idv();
	protected override splitedChecker = new Tsc<Hookable>();
}