import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { CachedFactory } from "cached-factory";

import { createRule } from "../utils.js";

function skipExportParent(node: TSESTree.Node & { parent: object }) {
	return node.parent.type == AST_NODE_TYPES.ExportNamedDeclaration
		? node.parent
		: node;
}

function skipModuleParent(node: TSESTree.Node & { parent: object }) {
	return node.parent.type === AST_NODE_TYPES.TSModuleDeclaration
		? node.parent
		: node;
}

export const rule = createRule({
	create(context) {
		const hasValueStatementCache = new CachedFactory(
			(node: TSESTree.TSModuleDeclaration) =>
				!node.declare &&
				node.id.type !== AST_NODE_TYPES.Literal &&
				// https://github.com/typescript-eslint/typescript-eslint/issues/10486
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				node.body.body.some?.(isValueStatement),
		);

		function isValueStatement(
			node: TSESTree.NamedExportDeclarations | TSESTree.ProgramStatement,
		): boolean {
			switch (node.type) {
				case AST_NODE_TYPES.ExportNamedDeclaration:
					// "Export declarations are not permitted in a namespace.":
					// node.declaration is only null for disallowed `export { ... }`s.
					return !node.declaration || isValueStatement(node.declaration);

				case AST_NODE_TYPES.TSInterfaceDeclaration:
				case AST_NODE_TYPES.TSTypeAliasDeclaration:
					return false;

				case AST_NODE_TYPES.TSModuleDeclaration:
					return hasValueStatementCache.get(node);

				default:
					return true;
			}
		}

		return {
			TSModuleDeclaration(node) {
				if (
					hasValueStatementCache.get(node) &&
					skipExportParent(node).parent.type !== AST_NODE_TYPES.TSModuleBlock
				) {
					context.report({
						messageId: "namespace",
						node: skipModuleParent(node),
					});
				}
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's namespaces.",
		},
		messages: {
			namespace:
				"This namespace will not be allowed under TypeScript's --erasableSyntaxOnly.",
		},
		schema: [],
		type: "problem",
	},
	name: "namespaces",
});
