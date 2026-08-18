import { rule } from "./export-aliases.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.run("export-aliases", rule, {
	invalid: [
		{
			code: `export = values;`,
			errors: [
				{
					column: 1,
					endColumn: 17,
					endLine: 1,
					line: 1,
					messageId: "exportAlias",
					suggestions: [
						{
							messageId: "exportAliasDefaultFix",
							output: `export default values;`,
						},
					],
				},
			],
		},
		{
			code: `export = { value: 'a' }`,
			errors: [
				{
					column: 1,
					endColumn: 24,
					endLine: 1,
					line: 1,
					messageId: "exportAlias",
					suggestions: [
						{
							messageId: "exportAliasDefaultFix",
							output: `export default { value: 'a' };`,
						},
					],
				},
			],
		},
	],
	valid: [
		`export default values;`,
		`export { values };`,
		`
			declare module 'values' {
				export = values;
			}
		`,
	],
});
