"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetErr = exports.EType = exports.errs = void 0;
const errlib_1 = require("../errlib");
const base_1 = require("../types/base");
exports.errs = {
    ErrNoSuchFile: (files) => ({
        files,
    }),
    ErrNoParser: () => ({}),
    ErrNoSuchErr: (throwTracker) => ({
        throwTracker,
    }),
    ErrCannotBeImported: (moduleName) => ({
        moduleName,
    }),
    ErrUseBeforeDefine: (varName) => ({
        varName,
    }),
    ErrCannotBeSeted: (varName) => ({
        varName,
    }),
    ErrIllegalParameter: (args) => ({
        args,
    }),
    ErrForgetPathInfo: (node) => ({
        node,
    }),
    ErrIllegalVisitorName: (name) => ({
        name,
    }),
    ErrNoEnumText: (enumDomain, enumNumber) => ({
        enumDomain,
        enumNumber,
    }),
    ErrUnregisteredEnum: (enumObj) => ({
        enumObj,
    }),
    ErrInitWithoutGetter: (domain, instance) => ({
        domain,
        instance,
    }),
    ErrNotInList: (path) => ({
        path,
    }),
    ErrWrongTransfErrorSignal: (error) => ({
        error,
    }),
};
exports.EType = base_1.Enum.from((0, base_1.listKeyOf)(exports.errs));
function GetErr(...pele) {
    const [type, tracker, ...args] = pele;
    const typeName = exports.EType[type];
    if (!(typeName in exports.EType))
        return (0, errlib_1.throwErr)(exports.EType.ErrNoSuchErr, pele[1], Error());
    const fn = exports.errs[typeName];
    return {
        type,
        ...fn(...args),
        tracker,
    };
}
exports.GetErr = GetErr;
//# sourceMappingURL=errors.js.map