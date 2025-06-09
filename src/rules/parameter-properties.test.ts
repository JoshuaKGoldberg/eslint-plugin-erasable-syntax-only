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
				class A {
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
				class A {
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
					protected foo: number;
					constructor(
						readonly value: number,
					) {
						this.value = value * 2;
					}
				}
			`,
			errors: [
				{
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					readonly value: number;
protected foo: number;
					constructor(
						value: number,
					) {
						this.value = value * 2;
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
				const Values = class {
					constructor(
						private value: number
					) {}
				}
			`,
			errors: [
				{
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				const Values = class {
					private value: number;
constructor(
						value: number
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
						readonly value: number
					) {
						this.foo = 1;
					}
				}
			`,
			errors: [
				{
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					readonly value: number;
constructor(
						value: number
					) {
						this.value = value;
this.foo = 1;
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
						private value: number = 3
					) {}
				}
			`,
			errors: [
				{
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private value: number;
constructor(
						value: number = 3
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
