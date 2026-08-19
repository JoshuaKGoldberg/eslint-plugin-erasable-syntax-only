import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

function getFirstConstructor(method: TSESTree.MethodDefinition) {
	return method.parent.body.find(
		(member) =>
			member.type === AST_NODE_TYPES.MethodDefinition &&
			member.kind === "constructor",
	) as TSESTree.MethodDefinition;
}

function getLineIndentation(line: string) {
	return line.slice(0, line.length - line.trimStart().length);
}

function getPropertyName(node: TSESTree.TSParameterProperty) {
	const { parameter } = node;
	const name =
		parameter.type === AST_NODE_TYPES.AssignmentPattern
			? parameter.left
			: parameter;

	return name.typeAnnotation ? name : undefined;
}

function getSuperCall(body: TSESTree.BlockStatement) {
	return body.body.find(
		(statement) =>
			statement.type === AST_NODE_TYPES.ExpressionStatement &&
			statement.expression.type === AST_NODE_TYPES.CallExpression &&
			statement.expression.callee.type === AST_NODE_TYPES.Super,
	);
}

export const rule = createRule({
	create(context) {
		function createSuggestions(node: TSESTree.TSParameterProperty) {
			const { body } = node.parent;
			const method = node.parent.parent;
			const name = getPropertyName(node);

			if (
				!name ||
				node.decorators.length ||
				method.type !== AST_NODE_TYPES.MethodDefinition ||
				body?.type !== AST_NODE_TYPES.BlockStatement
			) {
				return undefined;
			}

			const { superClass } = method.parent.parent;
			const superCall = superClass ? getSuperCall(body) : undefined;

			if (superClass && !superCall) {
				return undefined;
			}

			// Overload signatures must stay adjacent to their implementation.
			const target = getFirstConstructor(method);
			const modifiers = context.sourceCode
				.getText()
				.slice(node.range[0], node.parameter.range[0]);
			const property = `${modifiers}${context.sourceCode.getText(name)};\n${getIndentation(target)}`;
			const assignment = `\n${getInnerIndentation(method)}this.${name.name} = ${name.name};`;
			const isBodyEmpty =
				!body.body.length && !context.sourceCode.getCommentsInside(body).length;

			return [
				{
					fix: (fixer: TSESLint.RuleFixer) => [
						fixer.insertTextBefore(target, property),
						fixer.removeRange([node.range[0], node.parameter.range[0]]),
						superCall
							? fixer.insertTextAfter(superCall, assignment)
							: fixer.insertTextAfterRange(
									[body.range[0], body.range[0] + 1],
									`${assignment}${isBodyEmpty ? `\n${getIndentation(method)}` : ""}`,
								),
					],
					messageId: "parameterPropertyFix" as const,
				},
			];
		}

		function getIndentation(member: TSESTree.Node) {
			return getLineIndentation(
				context.sourceCode.lines[member.loc.start.line - 1],
			);
		}

		function getInnerIndentation(method: TSESTree.MethodDefinition) {
			const classIndentation = getLineIndentation(
				context.sourceCode.lines[method.parent.parent.loc.start.line - 1],
			);
			const methodIndentation = getIndentation(method);

			return (
				methodIndentation +
				(methodIndentation.slice(classIndentation.length) || "\t")
			);
		}

		return {
			TSParameterProperty(node) {
				context.report({
					messageId: "parameterProperty",
					node,
					suggest: createSuggestions(node),
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
			parameterPropertyFix:
				"Replace the parameter property with a class property.",
		},
		schema: [],
		type: "problem",
	},
	name: "parameter-properties",
});
