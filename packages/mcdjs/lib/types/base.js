"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = exports.ArrayMap = exports.InitializableMap = exports.Enum = exports.listKeyOf = void 0;
function listKeyOf(n) {
    return Object.keys(n);
}
exports.listKeyOf = listKeyOf;
var Enum;
(function (Enum) {
    const keyMap = new Map;
    function keyOf(which) {
        if (keyMap.has(which))
            return keyMap.get(which);
        const keys = mapIn(which, (_, k) => k);
        keyMap.set(which, keys);
        return keys;
    }
    Enum.keyOf = keyOf;
    const valueMap = new Map;
    function valueOf(which) {
        if (valueMap.has(which))
            return valueMap.get(which);
        const values = mapIn(which, v => v);
        valueMap.set(which, values);
        return values;
    }
    Enum.valueOf = valueOf;
    function from(keys) {
        const rslt = {};
        keys.forEach((key, value) => rslt[rslt[key] = value] = key);
        return rslt;
    }
    Enum.from = from;
    function isKeyOf(which, n) {
        return typeof which[n] === 'number';
    }
    Enum.isKeyOf = isKeyOf;
    function mapIn(which, cb) {
        const rslt = [];
        let i = 0;
        while (i in which)
            rslt.push(cb(i, which[i++]));
        return rslt;
    }
    Enum.mapIn = mapIn;
})(Enum || (exports.Enum = Enum = {}));
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
class ArrayMap extends InitializableMap {
    initializeValue() {
        return [];
    }
    push(key, ...items) {
        this.forceGet(key).push(...items);
    }
}
exports.ArrayMap = ArrayMap;
var Template;
(function (Template) {
    function join(...args) {
        const [{ raw }, ...values] = args;
        const outArr = [];
        values.forEach((n, i) => outArr.push(raw[i], n));
        outArr.push(raw.at(-1));
        return outArr.join('');
    }
    Template.join = join;
})(Template || (exports.Template = Template = {}));
//# sourceMappingURL=base.js.map