import { rule } from "./enums.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.run("enums", rule, {
	invalid: [
		{
			code: `enum Values {}`,
			errors: [
				{
					column: 1,
					endColumn: 15,
					endLine: 1,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `enum Values {
  Numeric = 0,
  Stringy = ''
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 4,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  Numeric: 0,
  Stringy: ''
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `enum Values {
  Wildly,
  Out = 9001,
  Of,
  Order = 10,
  Numbers
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 7,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  Wildly: 0,
  Out: 9001,
  Of: 9002,
  Order: 10,
  Numbers: 11
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `/* a */ /* b */ export /* c */ /* d */ enum /* e */ /* f */ Values /* g */ /* h */ { /* i */ /* j */
  /* k */ /* l */ A /* m */ /* n */
/* o */ /* p */ } /* q */ /* r */`,
			errors: [
				{
					column: 40,
					endColumn: 18,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `/* a */ /* b */ export /* c */ /* d */ const /* e */ /* f */ Values /* g */ /* h */ = { /* i */ /* j */
  /* k */ /* l */ A: 0 /* m */ /* n */
/* o */ /* p */ } as const

export type Values = typeof Values[keyof typeof Values] /* q */ /* r */`,
						},
					],
				},
			],
		},
		{
			code: `export enum Values {
  null,
  undefined,
  NaN,
  A
}`,
			errors: [
				{
					column: 8,
					endColumn: 2,
					endLine: 6,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `export const Values = {
  null: 0,
  undefined: 1,
  NaN: 2,
  A: 3
} as const

export type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `const enum Values {
  A
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  A: 0
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `export const enum Mode {
  build = 'build',
  debug = 'debug'
}`,
			errors: [
				{
					column: 8,
					endColumn: 2,
					endLine: 4,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `export const Mode = {
  build: 'build',
  debug: 'debug'
} as const

export type Mode = typeof Mode[keyof typeof Mode]`,
						},
					],
				},
			],
		},
		{
			code: `/* a */ export /* b */ const /* c */ enum /* d */ Values {
  A
}`,
			errors: [
				{
					column: 24,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `/* a */ export /* b */ const /* d */ Values = {
  A: 0
} as const

export type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `declare enum Values {
  A
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
				},
			],
		},
		{
			code: `declare const enum Values {
  A
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
				},
			],
		},
		{
			code: `export declare const enum Values {
  A
}`,
			errors: [
				{
					column: 8,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
				},
			],
		},
		{
			code: `namespace Values {
  export enum Inner {
    A
  }
}`,
			errors: [
				{
					column: 10,
					endColumn: 4,
					endLine: 4,
					line: 2,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `namespace Values {
  export const Inner = {
    A: 0
  } as const

  export type Inner = typeof Inner[keyof typeof Inner]
}`,
						},
					],
				},
			],
		},
		{
			code: `namespace Values {
  enum Inner {
    A
  }
}`,
			errors: [
				{
					column: 3,
					endColumn: 4,
					endLine: 4,
					line: 2,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `namespace Values {
  const Inner = {
    A: 0
  } as const

  type Inner = typeof Inner[keyof typeof Inner]
}`,
						},
					],
				},
			],
		},
		{
			code: `function make() {
  enum Values {
    A
  }
}`,
			errors: [
				{
					column: 3,
					endColumn: 4,
					endLine: 4,
					line: 2,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `function make() {
  const Values = {
    A: 0
  } as const

  type Values = typeof Values[keyof typeof Values]
}`,
						},
					],
				},
			],
		},
		{
			code: `enum Values {
  A
}

console.log(Values.A);`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  A: 0
} as const

type Values = typeof Values[keyof typeof Values]

console.log(Values.A);`,
						},
					],
				},
			],
		},
		{
			code: `declare module 'values' {
  export enum Values {
    A
  }
}`,
			errors: [
				{
					column: 10,
					endColumn: 4,
					endLine: 4,
					line: 2,
					messageId: "enum",
				},
			],
		},
		{
			code: `declare namespace Values {
  export enum Inner {
    A
  }
}`,
			errors: [
				{
					column: 10,
					endColumn: 4,
					endLine: 4,
					line: 2,
					messageId: "enum",
				},
			],
		},
		{
			code: `enum Values {
  Shifted = 1 << 2
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  Shifted: 1 << 2
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `enum Values {
  Concatenated = 'a' + 'b'
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  Concatenated: 'a' + 'b'
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `enum Values {
  Negative = -1
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  Negative: -1
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `enum Values {
  Templated = \`a\`
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  Templated: \`a\`
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `enum Values {
  A = 1,
  B = A << 1
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 4,
					line: 1,
					messageId: "enum",
				},
			],
		},
		{
			code: `enum Values {
  Shifted = 1 << 2,
  Next
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 4,
					line: 1,
					messageId: "enum",
				},
			],
		},
		{
			code: `enum Values {
  'a-b' = 1
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 3,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
  'a-b': 1
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
		{
			code: `const OUTSIDE = 3;
enum Values {
  A = OUTSIDE
}`,
			errors: [
				{
					column: 1,
					endColumn: 2,
					endLine: 4,
					line: 2,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const OUTSIDE = 3;
const Values = {
  A: OUTSIDE
} as const

type Values = typeof Values[keyof typeof Values]`,
						},
					],
				},
			],
		},
	],
	valid: [`const Values = {};`, `const Values = {} as const;`],
});
