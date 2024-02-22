"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tranumEType = exports.some = void 0;
const text_1 = require("../config/text");
const errors_1 = require("./errors");
exports.some = (0, text_1.initText)({
    tracker: {
        'zh-CN': `以下追踪信息仅供参考`,
    },
});
exports.tranumEType = (0, text_1.regEnum)('EType', errors_1.EType, {
    ErrNoSuchFile: {
        'zh-CN': '找不到文件',
        'en-US': 'Cannot find such file',
    },
    ErrNoParser: {
        'zh-CN': '没有可用的解析器',
        'en-US': 'No available parser',
    },
    ErrNoSuchErr: {
        'zh-CN': '没有这种错误类型',
        'en-US': 'Wrong error type',
    },
    ErrCannotBeImported: {
        'zh-CN': '此模块不允许被引入',
        'en-US': 'The module is not allowed to be imported',
    },
    ErrUseBeforeDefine: '变量在预定义完成前被引用',
    ErrCannotBeSeted: {
        'zh-CN': '此变量无法被赋值',
        'en-US': 'The variable is not allowed to be assigned',
    },
    ErrIllegalParameter: {
        'zh-CN': '非法的参数',
        'en-US': 'Illegal Parameter given',
    },
    ErrForgetPathInfo: {
        'zh-CN': '初始化节点时未注册路径信息',
        'en-US': 'Forget to regist PathInfo when initialize a Node',
    },
    ErrIllegalVisitorName: {
        'zh-CN': '错误的访问器名称',
        'en-US': 'Illegal vistor name',
    },
    ErrNoEnumText: '找不到枚举对应的文本',
    ErrUnregisteredEnum: '使用了未被注册的枚举',
    ErrInitWithoutGetter: '未使用要求的工厂函数获取实例',
    ErrNotInList: '节点不在列表里',
    ErrWrongTransfErrorSignal: '未知转义错误代码',
});
//# sourceMappingURL=text.js.map