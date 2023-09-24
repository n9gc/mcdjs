/**
 * @module mcdjs/lib-splited/exports
 * @version 0.0.2
 * @license GPL-2.0-or-later
 */
/// <reference path="./index.ts" />
(<any>McdJSPort) = globalThis.McdJSPort;

namespace McdJSPort {
	export namespace Node {
		export import CodeBlock = libs.internalTemp.CodeBlock;
		export import Command = libs.internalTemp.Command;
		export import Branch = libs.internalTemp.Branch;
		export import CBGroup = libs.internalTemp.CBGroup;
		export import NameSpace = libs.internalTemp.NameSpace;
		export import CommandRslt = libs.internalTemp.CommandRslt;
		export import Selector = libs.internalTemp.Selector;
		export import ExpressionAnd = libs.internalTemp.ExpressionAnd;
		export import ExpressionOr = libs.internalTemp.ExpressionOr;
		export import ExpressionNot = libs.internalTemp.ExpressionNot;
		export import ExpressionNand = libs.internalTemp.ExpressionNand;
		export import ExpressionNor = libs.internalTemp.ExpressionNor;
		export import ExpressionXor = libs.internalTemp.ExpressionXor;
		export import ExpressionXnor = libs.internalTemp.ExpressionXnor;
	}
}

