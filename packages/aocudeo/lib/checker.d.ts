/**
 * 各种检查器
 * @module aocudeo/lib/checker
 * @version 2.0.5
 * @license GPL-2.0-or-later
 */
declare module './checker';
import type { Id, MapObj } from './types';
export declare class SignChecker<I extends Id> {
    protected readonly ensureds: Set<I>;
    protected readonly requireds: Set<I>;
    countEnsureds(): number;
    getEnsureds(): Set<I>;
    isEnsured(id: I): boolean;
    isRequired(id: I): boolean;
    ensure(...ids: I[]): void;
    require(...ids: I[]): void;
    tryThrow(): void;
}
export declare class CircleChecker {
    private readonly edgeMap;
    private readonly circle;
    private readonly checkedChecker;
    private out;
    private mark;
    private unmark;
    private from;
    /**@deprecated 请使用 {@link CircleChecker.prototype.tryThrow|`CircleChecker#tryThrow`} 代替此方法 */
    throw(): void;
    tryThrow(): void;
    constructor(edgeMap: MapObj<readonly Id[]>);
}
