/**
 * 游戏相关类型定义模块
 * @module mcdjs/lib/types/game
 * @version 1.5.0
 * @license GPL-2.0-or-later
 */
declare module './game';
/**接口标识 */
export declare enum TypeId {
    CommandRslt = 0,
    Selected = 1,
    SimTag = 2
}
export declare const tranumTypeId: import("../config/text").GetTextFn<typeof TypeId>;
/**命令方块类型 */
export declare enum CbType {
    Impulse = 0,
    Chain = 1,
    Repeat = 2
}
export declare const tranumCbType: import("../config/text").GetTextFn<typeof CbType>;
/**命令方块信息 */
export interface CbInfo {
    /**提示信息 */
    note: string;
    /**命令方块种类 */
    cbType: CbType | null;
    /**指令内容 */
    command: string;
    /**延迟时间 */
    delay: number | null;
    /**是否是有条件的 */
    conditional: boolean | null;
    /**是否需要红石信号 */
    redstone: boolean | null;
}
/**命令运行结果 */
export interface CommandRslt {
    index: number;
    tid: TypeId.CommandRslt;
}
export import Sim = Sim.All;
export import SimTag = Sim.Tag;
export declare namespace Sim {
    /**形式数据 */
    interface Base {
        tid: TypeId;
        name: string;
    }
    /**形式标签 */
    interface Tag extends Base {
        toString(): string;
        tid: TypeId.SimTag;
    }
    /**所有形式数据 */
    type All = SimTag;
}
export import Expression = Expression.Calcable;
export declare namespace Expression {
    /**单目运算符 */
    type OperatorSig = '!' | 'not';
    /**双目运算符 */
    type OperatorBin = '&' | 'and' | '|' | 'or' | 'nand' | 'nor' | 'xor' | 'xnor';
    /**运算符 */
    type Operator = OperatorBin | OperatorSig;
    /**可操作类型 */
    type Calcable = Sub | Sim | SelectString | Selected | CommandRslt;
    /**单目表达式 */
    type SubSig = [OperatorSig, Calcable];
    /**双目表达式 */
    type SubBin = [Calcable, OperatorBin, Calcable];
    /**子表达式 */
    type Sub = SubSig | SubBin;
}
export import Selected = Select.Obj;
export import SelectString = Select.At;
/**选择相关 */
export declare namespace Select {
    /**选择器结果 */
    interface Obj {
        expr: Expression;
        tid: TypeId.Selected;
    }
    /**选择字符串 */
    type At = '@r' | '@a' | '@p' | '@s' | '@e';
}
