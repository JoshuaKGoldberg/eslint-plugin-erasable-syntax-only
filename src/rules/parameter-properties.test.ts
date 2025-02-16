import { rule } from "./parameter-properties.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.run("parameter-properties", rule, {
	invalid: [
		{
			code: `
				class Values {
					constructor(
						private value: number,
					) {}
				}
			`,
			errors: [
				{
					column: 7,
					endColumn: 28,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					constructor(
						value: number,
					) {}
				}
			`,
						},
					],
				},
			],
		},
		{
			code: `
				class Values {
					constructor(
						readonly value: number,
					) {}
				}
			`,
			errors: [
				{
					column: 7,
					endColumn: 29,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					constructor(
						value: number,
					) {}
				}
			`,
						},
					],
				},
			],
		},
	],
	valid: [
		`
			class Values {
				constructor(
					value: number,
				) {}
			}
		`,
	],
});
