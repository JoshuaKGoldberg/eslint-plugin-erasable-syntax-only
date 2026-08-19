import {
	AST_NODE_TYPES,
	AST_TOKEN_TYPES,
	TSESTree,
} from "@typescript-eslint/utils";

import { createRule } from "../utils.js";

interface EnumMemberContent {
	content: string;
	range: TSESTree.Range;
}

function isAmbient(node: TSESTree.TSEnumDeclaration) {
	if (node.declare) {
		return true;
	}

	for (
		let ancestor: TSESTree.Node | undefined = node.parent;
		ancestor;
		ancestor = ancestor.parent
	) {
		if (
			ancestor.type === AST_NODE_TYPES.TSModuleDeclaration &&
			ancestor.declare
		) {
			return true;
		}
	}

	return false;
}

export const rule = createRule({
	create(context) {
		function getConstReplacementRange(
			node: TSESTree.TSEnumDeclaration,
		): TSESTree.Range | undefined {
			const enumToken = context.sourceCode.getFirstToken(
				node,
				(token) => token.value === "enum",
			);

			if (!enumToken) {
				return undefined;
			}

			if (!node.const) {
				return enumToken.range;
			}

			const constToken = context.sourceCode.getFirstToken(
				node,
				(token) => token.value === "const",
			);

			return constToken ? [constToken.range[0], enumToken.range[1]] : undefined;
		}

		function getMemberContents(
			node: TSESTree.TSEnumDeclaration,
		): EnumMemberContent[] | undefined {
			const memberNames = new Set(
				node.body.members.map((member) =>
					member.id.type === AST_NODE_TYPES.Identifier
						? member.id.name
						: undefined,
				),
			);
			const contents: EnumMemberContent[] = [];
			let nextAutoValue: number | undefined = 0;

			for (const member of node.body.members) {
				const name = context.sourceCode.getText(member.id);

				if (!member.initializer) {
					if (nextAutoValue === undefined) {
						return undefined;
					}

					contents.push({
						content: `${name}: ${nextAutoValue.toString()}`,
						range: member.range,
					});
					nextAutoValue += 1;
					continue;
				}

				if (referencesMember(member.initializer, memberNames)) {
					return undefined;
				}

				contents.push({
					content: `${name}: ${context.sourceCode.getText(member.initializer)}`,
					range: member.range,
				});

				// Members after a computed value can't be given an auto-incremented one.
				nextAutoValue =
					member.initializer.type === AST_NODE_TYPES.Literal &&
					typeof member.initializer.value === "number"
						? member.initializer.value + 1
						: undefined;
			}

			return contents;
		}

		function getIndentation(node: TSESTree.Node) {
			return /^\s*/.exec(
				context.sourceCode.lines[node.loc.start.line - 1],
			)?.[0];
		}

		function referencesMember(
			initializer: TSESTree.Expression,
			memberNames: Set<string | undefined>,
		) {
			return context.sourceCode
				.getTokens(initializer)
				.some(
					(token) =>
						token.type === AST_TOKEN_TYPES.Identifier &&
						memberNames.has(token.value),
				);
		}

		return {
			TSEnumDeclaration(node) {
				const name = node.id.name;
				const target =
					node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration
						? node.parent
						: node;
				const constReplacementRange = getConstReplacementRange(node);
				const contents = isAmbient(node) ? undefined : getMemberContents(node);
				const indentation = getIndentation(target);

				context.report({
					messageId: "enum",
					node,
					suggest:
						constReplacementRange && contents && indentation !== undefined
							? [
									{
										fix(fixer) {
											return [
												fixer.replaceTextRange(constReplacementRange, "const"),
												fixer.insertTextBefore(node.body, "= "),
												...contents.map(({ content, range }) =>
													fixer.replaceTextRange(range, content),
												),
												fixer.insertTextAfter(node.body, " as const"),
												fixer.insertTextAfter(
													target,
													`\n\n${indentation}${target === node ? "" : "export "}type ${name} = typeof ${name}[keyof typeof ${name}]`,
												),
											];
										},
										messageId: "enumFix",
									},
								]
							: null,
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
			enumFix: "Replace enum with an equivalent object literal.",
		},
		schema: [],
		type: "problem",
	},
	name: "enums",
});
