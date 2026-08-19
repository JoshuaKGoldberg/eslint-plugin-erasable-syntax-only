import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { CachedFactory } from "cached-factory";

import { createRule } from "../utils.js";

interface ConvertibleDeclarator {
	init: TSESTree.Expression;
	nameEnd: number;
	nameStart: number;
}

interface ConvertibleFunction extends ConvertibleStatementBase {
	functionRange: TSESTree.Range;
	type: "function";
}

interface ConvertibleNamespace {
	body: TSESTree.TSModuleBlock;
	id: TSESTree.Identifier;
	statements: ConvertibleStatement[];
}

type ConvertibleStatement = ConvertibleFunction | ConvertibleVariable;

interface ConvertibleStatementBase {
	declarationRange: TSESTree.Range;
	isReferenced: boolean;
	lastToken: TSESTree.Token;
	names: string[];
	statement: TSESTree.ExportNamedDeclaration;
}

interface ConvertibleVariable extends ConvertibleStatementBase {
	declarators: ConvertibleDeclarator[];
	type: "variable";
}

type MessageId = "namespace" | "namespaceObjectFix" | "namespaceRemoveFix";

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

		function getConvertibleNamespace(
			node: TSESTree.TSModuleDeclaration,
		): ConvertibleNamespace | undefined {
			const { body, id } = node;

			if (
				body?.type !== AST_NODE_TYPES.TSModuleBlock ||
				id.type !== AST_NODE_TYPES.Identifier ||
				isSelfReferential(node, body)
			) {
				return undefined;
			}

			const statements: ConvertibleStatement[] = [];

			for (const statement of body.body) {
				const converted = getConvertibleStatement(statement);
				if (!converted) {
					return undefined;
				}

				statements.push(converted);
			}

			return { body, id, statements };
		}

		function getConvertibleStatement(
			statement: TSESTree.ProgramStatement,
		): ConvertibleStatement | undefined {
			if (
				statement.type !== AST_NODE_TYPES.ExportNamedDeclaration ||
				!statement.declaration
			) {
				return undefined;
			}

			const { declaration } = statement;
			const lastToken = context.sourceCode.getLastToken(statement);

			if (!lastToken) {
				return undefined;
			}

			const variables = context.sourceCode.getDeclaredVariables(declaration);
			const isReferenced = variables.some((variable) =>
				variable.references.some((reference) => !reference.init),
			);
			const names = variables.map((variable) => variable.name);

			switch (declaration.type) {
				case AST_NODE_TYPES.FunctionDeclaration: {
					const functionRange = getFunctionKeywordRange(declaration);

					return functionRange
						? {
								declarationRange: declaration.range,
								functionRange,
								isReferenced,
								lastToken,
								names,
								statement,
								type: "function",
							}
						: undefined;
				}

				case AST_NODE_TYPES.VariableDeclaration: {
					const declarators: ConvertibleDeclarator[] = [];

					for (const { id, init } of declaration.declarations) {
						if (id.type !== AST_NODE_TYPES.Identifier || !init) {
							return undefined;
						}

						declarators.push({
							init,
							nameEnd: id.typeAnnotation?.range[0] ?? id.range[1],
							nameStart: id.range[0],
						});
					}

					return {
						declarationRange: declaration.range,
						declarators,
						isReferenced,
						lastToken,
						names,
						statement,
						type: "variable",
					};
				}

				default:
					return undefined;
			}
		}

		function getFunctionKeywordRange(
			declaration: TSESTree.FunctionDeclaration,
		): TSESTree.Range | undefined {
			const functionToken = context.sourceCode.getFirstToken(
				declaration,
				(token) => token.value === "function",
			);
			const tokenAfter =
				functionToken && context.sourceCode.getTokenAfter(functionToken);

			return functionToken && tokenAfter
				? [functionToken.range[0], tokenAfter.range[0]]
				: undefined;
		}

		function isSelfReferential(
			node: TSESTree.TSModuleDeclaration,
			body: TSESTree.TSModuleBlock,
		) {
			return context.sourceCode
				.getDeclaredVariables(node)
				.some(
					(variable) =>
						variable.defs.length > 1 ||
						variable.references.some(
							(reference) =>
								reference.identifier.range[0] >= body.range[0] &&
								reference.identifier.range[1] <= body.range[1],
						),
				);
		}

		function canRemove(
			node: TSESTree.TSModuleDeclaration,
			statements: ConvertibleStatement[],
		) {
			const variable = context.sourceCode.getDeclaredVariables(node).at(0);

			return (
				!!variable &&
				!variable.references.length &&
				!statements.some((statement) =>
					statement.names.some((name) => variable.scope.set.has(name)),
				)
			);
		}

		function createSuggestions(
			node: TSESTree.TSModuleDeclaration,
		): TSESLint.SuggestionReportDescriptor<MessageId>[] | undefined {
			const convertible = getConvertibleNamespace(node);

			if (!convertible) {
				return undefined;
			}

			const { body, id, statements } = convertible;

			const suggestions: TSESLint.SuggestionReportDescriptor<MessageId>[] = [];

			if (canRemove(node, statements)) {
				suggestions.push({
					*fix(fixer) {
						const target = skipExportParent(node);

						yield fixer.removeRange([target.range[0], body.range[0] + 1]);
						yield fixer.removeRange([body.range[1] - 1, body.range[1]]);

						if (target === node) {
							for (const { declarationRange, statement } of statements) {
								yield fixer.removeRange([
									statement.range[0],
									declarationRange[0],
								]);
							}
						}
					},
					messageId: "namespaceRemoveFix",
				});
			}

			// Members referenced by other members would no longer be in scope as
			// properties of an object, so only namespaces without them can convert.
			if (!statements.some((statement) => statement.isReferenced)) {
				suggestions.push({
					*fix(fixer) {
						yield fixer.replaceTextRange(
							[node.range[0], body.range[0] + 1],
							`const ${id.name} = {`,
						);

						for (const converted of statements) {
							yield* createPropertyFixes(fixer, converted);
						}

						yield fixer.replaceTextRange(
							[body.range[1] - 1, body.range[1]],
							"};",
						);
					},
					messageId: "namespaceObjectFix",
				});
			}

			return suggestions.length ? suggestions : undefined;
		}

		function* createPropertyFixes(
			fixer: TSESLint.RuleFixer,
			converted: ConvertibleStatement,
		) {
			const { lastToken, statement } = converted;

			if (converted.type === "variable") {
				yield fixer.removeRange([
					statement.range[0],
					converted.declarators[0].nameStart,
				]);

				for (const { init, nameEnd } of converted.declarators) {
					yield fixer.replaceTextRange([nameEnd, init.range[0]], ": ");
				}
			} else {
				yield fixer.removeRange([
					statement.range[0],
					converted.declarationRange[0],
				]);
				yield fixer.removeRange(converted.functionRange);
			}

			yield lastToken.value === ";"
				? fixer.replaceText(lastToken, ",")
				: fixer.insertTextAfter(statement, ",");
		}

		return {
			TSModuleDeclaration(node) {
				if (
					hasValueStatementCache.get(node) &&
					skipExportParent(node).parent.type !== AST_NODE_TYPES.TSModuleBlock
				) {
					const reported = skipModuleParent(node);

					context.report({
						messageId: "namespace",
						node: reported,
						suggest: reported === node ? createSuggestions(node) : undefined,
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
		hasSuggestions: true,
		messages: {
			namespace:
				"This namespace will not be allowed under TypeScript's --erasableSyntaxOnly.",
			namespaceObjectFix: "Replace the namespace with an object.",
			namespaceRemoveFix: "Remove the namespace, keeping its contents.",
		},
		schema: [],
		type: "problem",
	},
	name: "namespaces",
});
