"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tranumCbType = exports.CbType = exports.tranumTypeId = exports.TypeId = void 0;
const text_1 = require("../config/text");
/**接口标识 */
var TypeId;
(function (TypeId) {
    TypeId[TypeId["CommandRslt"] = 0] = "CommandRslt";
    TypeId[TypeId["Selected"] = 1] = "Selected";
    TypeId[TypeId["SimTag"] = 2] = "SimTag";
})(TypeId || (exports.TypeId = TypeId = {}));
exports.tranumTypeId = (0, text_1.regEnum)('TypeId', TypeId, {
    CommandRslt: '命令结果表示',
    Selected: '选择器表示',
    SimTag: '标签表示',
});
/**命令方块类型 */
var CbType;
(function (CbType) {
    CbType[CbType["Impulse"] = 0] = "Impulse";
    CbType[CbType["Chain"] = 1] = "Chain";
    CbType[CbType["Repeat"] = 2] = "Repeat";
})(CbType || (exports.CbType = CbType = {}));
exports.tranumCbType = (0, text_1.regEnum)('CbType', CbType, {
    Impulse: '脉冲',
    Chain: '链式',
    Repeat: '重复',
});
//# sourceMappingURL=game.js.map