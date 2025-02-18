import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";
import { RuleFix } from "@typescript-eslint/utils/ts-eslint";
import { isIdentifier } from "@typescript-eslint/utils/ast-utils";

export const rule = createRule({
	create(context) {
		return {
			TSParameterProperty(node) {
				const paramNode = node.parameter;
				if (
					paramNode.type !== AST_NODE_TYPES.Identifier &&
					paramNode.type !== AST_NODE_TYPES.AssignmentPattern
				) {
					return;
				}

				const classBody = node.parent.parent.parent;
				if (classBody?.type !== AST_NODE_TYPES.ClassBody) {
					return;
				}

				const constructor = node.parent;
				if (constructor.type !== AST_NODE_TYPES.FunctionExpression) {
					return;
				}

				let paramName = "";
				let typeAnnotation = "";
				const accessibility = node.accessibility
					? `${node.accessibility} `
					: "";
				const readonly = node.readonly ? "readonly " : "";
				if (
					paramNode.type === AST_NODE_TYPES.AssignmentPattern &&
					isIdentifier(paramNode.left)
				) {
					paramName = paramNode.left.name;
					typeAnnotation = context.sourceCode.getText(
						paramNode.left.typeAnnotation,
					);
				} else if (paramNode.type === AST_NODE_TYPES.Identifier) {
					paramName = paramNode.name;
					typeAnnotation = context.sourceCode.getText(paramNode.typeAnnotation);
				}
				const fieldDeclaration = `${accessibility}${readonly}${paramName}${typeAnnotation};`;

				const isAssignedInConstructor = constructor.body.body.some(
					(node) =>
						node.type === AST_NODE_TYPES.ExpressionStatement &&
						node.expression.type === AST_NODE_TYPES.AssignmentExpression &&
						node.expression.left.type === AST_NODE_TYPES.MemberExpression &&
						node.expression.left.object.type ===
							AST_NODE_TYPES.ThisExpression &&
						node.expression.left.property.type === AST_NODE_TYPES.Identifier &&
						node.expression.left.property.name === paramName,
				);

				const isConstructorBodyEmpty = constructor.body.body.length === 0;

				context.report({
					messageId: "parameterProperty",
					node,
					suggest: [
						{
							fix(fixer) {
								const fixes: RuleFix[] = [];
								fixes.push(
									fixer.insertTextBefore(
										classBody.body[0],
										`${fieldDeclaration}\n`,
									),
								);

								const parameter = context.sourceCode.getText(paramNode);
								fixes.push(fixer.replaceText(node, parameter));

								if (!isAssignedInConstructor) {
									const constructorBody = constructor.body;
									let assignmentStatement = `this.${paramName} = ${paramName};`;
									assignmentStatement += isConstructorBodyEmpty ? "\n" : "";

									fixes.push(
										fixer.insertTextAfterRange(
											[constructorBody.range[0], constructorBody.range[0] + 1],
											`\n${assignmentStatement}`,
										),
									);
								}

								return fixes;
							},
							messageId: "parameterPropertyFix",
						},
					],
				});
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's class parameter properties.",
		},
		hasSuggestions: true,
		messages: {
			parameterProperty:
				"This parameter property will not be allowed under TypeScript's --erasableSyntaxOnly.",
			parameterPropertyFix: "Remove parameter properties",
		},
		schema: [],
		type: "problem",
	},
	name: "parameter-properties",
});
