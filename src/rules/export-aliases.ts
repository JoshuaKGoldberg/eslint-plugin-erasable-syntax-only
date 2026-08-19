import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		return {
			TSExportAssignment(node) {
				if (node.parent.type !== AST_NODE_TYPES.Program) {
					return;
				}

				const equals = context.sourceCode.getTokenBefore(
					node.expression,
					(token) => token.value === "=",
				);

				context.report({
					messageId: "exportAlias",
					node,
					suggest: equals && [
						{
							fix(fixer) {
								const text = context.sourceCode.getText();

								return fixer.replaceText(
									equals,
									[
										/\s/.test(text[equals.range[0] - 1]) ? "" : " ",
										"default",
										/\s/.test(text[equals.range[1]]) ? "" : " ",
									].join(""),
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
