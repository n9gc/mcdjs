/**
 * @module mcdjs/lib-splited/exports
 * @version 0.0.1
 * @license GPL-2.0-or-later
 */
/// <reference path="./index.ts" />
(<any>McdJSPort) = globalThis.McdJSPort;

namespace McdJSPort {
	export namespace Node {
		export import CodeBlock = Lib.internalTemp.CodeBlock;
		export import Command = Lib.internalTemp.Command;
		export import Branch = Lib.internalTemp.Branch;
		export import CBGroup = Lib.internalTemp.CBGroup;
		export import NameSpace = Lib.internalTemp.NameSpace;
		export import CommandRslt = Lib.internalTemp.CommandRslt;
		export import Selector = Lib.internalTemp.Selector;
		export import ExpressionAnd = Lib.internalTemp.ExpressionAnd;
		export import ExpressionOr = Lib.internalTemp.ExpressionOr;
		export import ExpressionNot = Lib.internalTemp.ExpressionNot;
		export import ExpressionNand = Lib.internalTemp.ExpressionNand;
		export import ExpressionNor = Lib.internalTemp.ExpressionNor;
		export import ExpressionXor = Lib.internalTemp.ExpressionXor;
		export import ExpressionXnor = Lib.internalTemp.ExpressionXnor;
	}
}

