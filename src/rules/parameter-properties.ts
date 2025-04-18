import { createRule } from "../utils.js";

export const rule = createRule({
	create(context) {
		return {
			TSParameterProperty(node) {
				context.report({
					messageId: "parameterProperty",
					node,
				});
			},
		};
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: "Avoid using TypeScript's class parameter properties.",
		},
		messages: {
			parameterProperty:
				"This parameter property will not be allowed under TypeScript's --erasableSyntaxOnly.",
		},
		schema: [],
		type: "problem",
	},
	name: "parameter-properties",
});
