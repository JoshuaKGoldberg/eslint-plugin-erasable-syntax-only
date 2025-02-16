import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		return {
			TSParameterProperty(node) {
				context.report({
					messageId: "parameterProperty",
					node,
					suggest: [
						{
							fix(fixer) {
								return fixer.removeRange([
									node.range[0],
									node.parameter.range[0],
								]);
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
