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
							output: `const Values = {
} as const;

type Values = typeof Values[keyof typeof Values];`,
						},
					],
				},
			],
		},
		{
			code: `enum Values { A }`,
			errors: [
				{
					column: 1,
					endColumn: 18,
					endLine: 1,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
A: 0,
} as const;

type Values = typeof Values[keyof typeof Values];`,
						},
					],
				},
			],
		},
		{
			code: `enum Values { A, B, C = 1, D, E = 1 }`,
			errors: [
				{
					column: 1,
					endColumn: 38,
					endLine: 1,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `const Values = {
A: 0,
B: 1,
C: 1,
D: 2,
E: 1,
} as const;

type Values = typeof Values[keyof typeof Values];`,
						},
					],
				},
			],
		},
		{
			code: `export enum Values { A }`,
			errors: [
				{
					column: 8,
					endColumn: 25,
					endLine: 1,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `export const Values = {
A: 0,
} as const;

export type Values = typeof Values[keyof typeof Values];`,
						},
					],
				},
			],
		},
		{
			code: `export enum Values { A = false, B = true }`,
			errors: [
				{
					column: 8,
					endColumn: 43,
					endLine: 1,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `export const Values = {
A: false,
B: true,
} as const;

export type Values = typeof Values[keyof typeof Values];`,
						},
					],
				},
			],
		},
		{
			code: `export enum Values { A = "Foo", B = "Bar" }`,
			errors: [
				{
					column: 8,
					endColumn: 44,
					endLine: 1,
					line: 1,
					messageId: "enum",
					suggestions: [
						{
							messageId: "enumFix",
							output: `export const Values = {
A: "Foo",
B: "Bar",
} as const;

export type Values = typeof Values[keyof typeof Values];`,
						},
					],
				},
			],
		},
	],
	valid: [`const Values = {};`, `const Values = {} as const;`],
});
