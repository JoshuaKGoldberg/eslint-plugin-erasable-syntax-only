import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		return {
			TSImportEqualsDeclaration(node) {
				if (
					node.moduleReference.type === AST_NODE_TYPES.TSExternalModuleReference
				) {
					const importName = node.id.name;
					const importModule = node.moduleReference.expression.value;

					context.report({
						messageId: "importAlias",
						node,
						suggest: [
							{
								fix(fixer) {
									return fixer.replaceText(
										node,
										`import ${importName} from "${importModule}";`,
									);
								},
								messageId: "importAliasDefaultFix",
							},
							{
								fix(fixer) {
									return fixer.replaceText(
										node,
										`import * as ${importName} from "${importModule}";`,
									);
								},
								messageId: "importAliasNamespaceFix",
							},
						],
					});
				}
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's import aliases.",
		},
		hasSuggestions: true,
		messages: {
			importAlias:
				"This import alias will not be allowed under TypeScript's --erasableSyntaxOnly.",
			importAliasDefaultFix: "Switch to default import.",
			importAliasNamespaceFix: "Switch to namespace import.",
		},
		schema: [],
		type: "problem",
	},
	name: "import-aliases",
});
