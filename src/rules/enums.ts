import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		return {
			TSEnumDeclaration(node) {
				const name = node.id.name;
				let isExported = false;
				if (node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration) {
					isExported = true;
				}
				let count = 0;
				let body = ``;
				for (const enumMember of node.body.members) {
					if (enumMember.id.type !== AST_NODE_TYPES.Identifier) {
						return;
					}
					const propertyName = enumMember.id.name;
					if (
						enumMember.initializer &&
						enumMember.initializer.type === AST_NODE_TYPES.Literal
					) {
						const value = enumMember.initializer.value;
						if (typeof value === "number") {
							count = value + 1;
						}

						if (typeof value === "string") {
							body = `${body}\n${propertyName}: "${value}",`;
						} else {
							body = `${body}\n${propertyName}: ${String(value)},`;
						}
					} else {
						body = `${body}\n${propertyName}: ${String(count)},`;
						count += 1;
					}
				}

				context.report({
					messageId: "enum",
					node,
					suggest: [
						{
							fix(fixer) {
								const objectLiteral = `const ${name} = {${body}\n} as const;`;
								const unionType = `${isExported ? "export " : ""}type ${name} = typeof ${name}[keyof typeof ${name}];`;
								return [
									fixer.replaceText(node, `${objectLiteral}\n\n${unionType}`),
								];
							},
							messageId: "enumFix",
						},
					],
				});
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's enums.",
		},
		hasSuggestions: true,
		messages: {
			enum: "This enum will not be allowed under TypeScript's --erasableSyntaxOnly.",
			enumFix: "Convert enum into an equivalent object literal.",
		},
		schema: [],
		type: "problem",
	},
	name: "enums",
});
