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
		{
			code: `
				class Values extends Base {
					constructor(override readonly value: number) {
						super();
					}
				}
			`,
			errors: [
				{
					column: 18,
					endColumn: 49,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values extends Base {
					override readonly value: number;
					constructor(value: number) {
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
					protected constructor(private value: number) {}
				}
			`,
			errors: [
				{
					column: 28,
					endColumn: 49,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private value: number;
					protected constructor(value: number) {
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
				const Values = class {
					constructor(private value: number) {}
				};
			`,
			errors: [
				{
					column: 18,
					endColumn: 39,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				const Values = class {
					private value: number;
					constructor(value: number) {
						this.value = value;
					}
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				class Values {
					constructor(value: number);
					constructor(private value: number) {}
				}
			`,
			errors: [
				{
					column: 18,
					endColumn: 39,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private value: number;
					constructor(value: number);
					constructor(value: number) {
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
				class Values extends Base {
					constructor(private value: number) {
						const doubled = value * 2;
						super(doubled);
					}
				}
			`,
			errors: [
				{
					column: 18,
					endColumn: 39,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values extends Base {
					private value: number;
					constructor(value: number) {
						const doubled = value * 2;
						super(doubled);
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
				class Values extends Base {
					constructor(private value: number) {
						if (value) {
							super(value);
						} else {
							super(0);
						}
					}
				}
			`,
			errors: [
				{
					column: 18,
					endColumn: 39,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
				},
			],
		},
		{
			code: `
				class Values {
					other = 1;
					constructor(private value: number) {}
					method() {}
				}
			`,
			errors: [
				{
					column: 18,
					endColumn: 39,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					other = 1;
					private value: number;
					constructor(value: number) {
						this.value = value;
					}
					method() {}
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
					constructor(private value: number) {
						// A comment.
					}
				}
			`,
			errors: [
				{
					column: 18,
					endColumn: 39,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private value: number;
					constructor(value: number) {
						this.value = value;
						// A comment.
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
					constructor(/* a */ private /* b */ value /* c */: number) {}
				}
			`,
			errors: [
				{
					column: 26,
					endColumn: 63,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private /* b */ value /* c */: number;
					constructor(/* a */ value /* c */: number) {
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
						private value: {
							a: string;
						},
					) {}
				}
			`,
			errors: [
				{
					column: 7,
					endColumn: 8,
					endLine: 6,
					line: 4,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private value: {
							a: string;
						};
					constructor(
						value: {
							a: string;
						},
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
					constructor(private callback: () => void = () => {}) {}
				}
			`,
			errors: [
				{
					column: 18,
					endColumn: 57,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private callback: () => void;
					constructor(callback: () => void = () => {}) {
						this.callback = callback;
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
					constructor(private first: string, private second) {}
				}
			`,
			errors: [
				{
					column: 18,
					endColumn: 39,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				class Values {
					private first: string;
					constructor(first: string, private second) {
						this.first = first;
					}
				}
			`,
						},
					],
				},
				{
					column: 41,
					endColumn: 55,
					endLine: 3,
					line: 3,
					messageId: "parameterProperty",
				},
			],
		},
		{
			code: `
				function make() {
					class Values {
						constructor(private value: number) {}
					}
				}
			`,
			errors: [
				{
					column: 19,
					endColumn: 40,
					endLine: 4,
					line: 4,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `
				function make() {
					class Values {
						private value: number;
						constructor(value: number) {
							this.value = value;
						}
					}
				}
			`,
						},
					],
				},
			],
		},
		{
			code: `class Values { constructor(private value: number) {} }`,
			errors: [
				{
					column: 28,
					endColumn: 49,
					endLine: 1,
					line: 1,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `class Values { private value: number;
constructor(value: number) {
	this.value = value;
} }`,
						},
					],
				},
			],
		},
		{
			code: `class Values {
    constructor(private value: number) {}
}`,
			errors: [
				{
					column: 17,
					endColumn: 38,
					endLine: 2,
					line: 2,
					messageId: "parameterProperty",
					suggestions: [
						{
							messageId: "parameterPropertyFix",
							output: `class Values {
    private value: number;
    constructor(value: number) {
        this.value = value;
    }
}`,
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
