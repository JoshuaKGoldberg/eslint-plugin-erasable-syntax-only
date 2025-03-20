import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isIdentifier } from "@typescript-eslint/utils/ast-utils";
import { RuleFix } from "@typescript-eslint/utils/ts-eslint";

import { createRule } from "../utils.js";
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

				const modifiers: string[] = [];
				if (node.accessibility) {
					modifiers.push(`${node.accessibility} `);
				}
				if (node.readonly) {
					modifiers.push("readonly ");
				}
				const fieldDeclaration = `${modifiers.join()}${paramName}${typeAnnotation};`;

				const isParamAssignedInConstructor = constructor.body.body.some(
					(node) =>
						node.type === AST_NODE_TYPES.ExpressionStatement &&
						node.expression.type === AST_NODE_TYPES.AssignmentExpression &&
						node.expression.left.type === AST_NODE_TYPES.MemberExpression &&
						node.expression.left.object.type ===
							AST_NODE_TYPES.ThisExpression &&
						node.expression.left.property.type === AST_NODE_TYPES.Identifier &&
						node.expression.left.property.name === paramName,
				);

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

								if (!isParamAssignedInConstructor) {
									const isConstructorBodyEmpty =
										constructor.body.body.length === 0;

									const assignmentStatement = `this.${paramName} = ${paramName};`;
									if (isConstructorBodyEmpty) {
										fixes.push(
											fixer.replaceText(
												constructor.body,
												`{\n${assignmentStatement}\n}`,
											),
										);
									} else {
										fixes.push(
											fixer.insertTextBefore(
												constructor.body.body[0],
												`${assignmentStatement}\n`,
											),
										);
									}
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
