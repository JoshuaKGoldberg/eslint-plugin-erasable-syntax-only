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
								data: { module: importModule, name: importName },
								fix(fixer) {
									return fixer.replaceText(
										node,
										`import ${importName} from "${importModule}";`,
									);
								},
								messageId: "importAliasFix",
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
			importAliasFix: "Use `import {{name}} from '{{module}}'` instead.",
		},
		schema: [],
		type: "problem",
	},
	name: "import-aliases",
});
