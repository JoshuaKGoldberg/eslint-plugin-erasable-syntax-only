import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		return {
			TSExportAssignment(node) {
				if (node.parent.type !== AST_NODE_TYPES.Program) {
					return;
				}

				context.report({
					messageId: "exportAlias",
					node,
					suggest: [
						{
							fix(fixer) {
								return fixer.replaceText(
									node,
									`export default ${context.sourceCode.getText(node.expression)};`,
								);
							},
							messageId: "exportAliasDefaultFix",
						},
					],
				});
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's export aliases.",
		},
		hasSuggestions: true,
		messages: {
			exportAlias:
				"This export alias will not be allowed under TypeScript's --erasableSyntaxOnly.",
			exportAliasDefaultFix: "Switch to default export.",
		},
		schema: [],
		type: "problem",
	},
	name: "export-aliases",
});
