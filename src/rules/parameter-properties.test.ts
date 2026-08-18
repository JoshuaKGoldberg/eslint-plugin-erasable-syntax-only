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
					private value: number;
					constructor(
						value: number,
					) {
						this.value = value;
					}
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
					readonly value: number;
					constructor(
						value: number,
					) {
						this.value = value;
					}
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
						protected readonly value: number = 123,
					) {
						console.log(value);
					}
				}
			`,
			errors: [
				{
					column: 7,
					endColumn: 45,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					protected readonly value: number;
					constructor(
						value: number = 123,
					) {
						this.value = value;
						console.log(value);
					}
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
						public first: string,
						private second?: number,
					) {}
				}
			`,
			errors: [
				{
					column: 7,
					endColumn: 27,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					public first: string;
					constructor(
						first: string,
						private second?: number,
					) {
						this.first = first;
					}
				}
			`,
						},
					],
				},
				{
					column: 7,
					endColumn: 30,
					endLine: 5,
					line: 5,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private second?: number;
					constructor(
						public first: string,
						second?: number,
					) {
						this.second = second;
					}
				}
			`,
						},
					],
				},
			],
		},
		{
			code: `
				class Values extends Base {
					constructor(
						private value: number,
					) {
						super();
					}
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
				class Values extends Base {
					private value: number;
					constructor(
						value: number,
					) {
						super();
						this.value = value;
					}
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
						private value,
					) {}
				}
			`,
			errors: [
				{
					column: 7,
					endColumn: 20,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
				},
			],
		},
		{
			code: `
				class Values {
					constructor(
						@decorator() private value: number,
					) {}
				}
			`,
			errors: [
				{
					column: 7,
					endColumn: 41,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
				},
			],
		},
		{
			code: `
				class Values extends Base {
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
