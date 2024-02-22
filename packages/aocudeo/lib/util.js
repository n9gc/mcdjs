"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMap = exports.mapMapObj = exports.isIdArray = exports.getArray = exports.isArray = exports.throwError = exports.AocudeoError = exports.ErrorType = exports.ArrayMap = exports.SurePositionMap = exports.InitializableMap = void 0;
const position_1 = require("./position");
class InitializableMap extends Map {
    forceGet(key) {
        let value = this.get(key);
        if (value)
            return value;
        value = this.initializeValue();
        this.set(key, value);
        return value;
    }
}
exports.InitializableMap = InitializableMap;
class SurePositionMap extends InitializableMap {
    initializeValue() {
        return new position_1.SurePosition({});
    }
}
exports.SurePositionMap = SurePositionMap;
class ArrayMap extends InitializableMap {
    initializeValue() {
        return [];
    }
    push(key, ...items) {
        this.forceGet(key).push(...items);
    }
}
exports.ArrayMap = ArrayMap;
/**错误类型 */
var ErrorType;
(function (ErrorType) {
    /**在 {@link Organizer.start|`Loader.START`} 前插入模块 */
    ErrorType[ErrorType["InsertBeforeStart"] = 0] = "InsertBeforeStart";
    /**在 {@link Organizer.end|`Loader.END`} 后插入模块 */
    ErrorType[ErrorType["InsertAfterEnd"] = 1] = "InsertAfterEnd";
    /**出现了环形引用 */
    ErrorType[ErrorType["CircularReference"] = 2] = "CircularReference";
    /**加载时仍有被引用的模块未被插入 */
    ErrorType[ErrorType["UnregistedCodeUnits"] = 3] = "UnregistedCodeUnits";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
class AocudeoError {
    constructor(type, tracker, infos) {
        this.type = ErrorType[type];
        Object.assign(this, infos);
        this.tracker = tracker;
    }
    type;
}
exports.AocudeoError = AocudeoError;
function throwError(type, tracker, infos) {
    throw new AocudeoError(type, tracker, infos);
}
exports.throwError = throwError;
exports.isArray = Array.isArray;
function getArray(mayArray) {
    return (0, exports.isArray)(mayArray) ? mayArray : [mayArray];
}
exports.getArray = getArray;
function isIdArray(n) {
    return typeof n[0] !== 'object';
}
exports.isIdArray = isIdArray;
function mapMapObj(mapObj, walker) {
    Reflect.ownKeys(mapObj).forEach(id => {
        const n = mapObj[id];
        if (typeof n !== 'undefined')
            walker(n, id);
    });
}
exports.mapMapObj = mapMapObj;
/**遍历 {@link map} */
function mapMap(map, walker) {
    map instanceof Map
        ? map.forEach(walker)
        : mapMapObj(map, walker);
}
exports.mapMap = mapMap;
//# sourceMappingURL=util.js.map