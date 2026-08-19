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
							output: `export default { value: 'a' }`,
						},
					],
				},
			],
		},
		{
			code: `export=values;`,
			errors: [
				{
					column: 1,
					endColumn: 15,
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
			code: `export /* a */ = /* b */ values; // c`,
			errors: [
				{
					column: 1,
					endColumn: 33,
					endLine: 1,
					line: 1,
					messageId: "exportAlias",
					suggestions: [
						{
							messageId: "exportAliasDefaultFix",
							output: `export /* a */ default /* b */ values; // c`,
						},
					],
				},
			],
		},
		{
			code: `export = values.nested.deeper;`,
			errors: [
				{
					column: 1,
					endColumn: 31,
					endLine: 1,
					line: 1,
					messageId: "exportAlias",
					suggestions: [
						{
							messageId: "exportAliasDefaultFix",
							output: `export default values.nested.deeper;`,
						},
					],
				},
			],
		},
		{
			code: `export = class Values {};`,
			errors: [
				{
					column: 1,
					endColumn: 26,
					endLine: 1,
					line: 1,
					messageId: "exportAlias",
					suggestions: [
						{
							messageId: "exportAliasDefaultFix",
							output: `export default class Values {};`,
						},
					],
				},
			],
		},
		{
			code: `export = function values() {};`,
			errors: [
				{
					column: 1,
					endColumn: 31,
					endLine: 1,
					line: 1,
					messageId: "exportAlias",
					suggestions: [
						{
							messageId: "exportAliasDefaultFix",
							output: `export default function values() {};`,
						},
					],
				},
			],
		},
		{
			code: `export = () => 'a';`,
			errors: [
				{
					column: 1,
					endColumn: 20,
					endLine: 1,
					line: 1,
					messageId: "exportAlias",
					suggestions: [
						{
							messageId: "exportAliasDefaultFix",
							output: `export default () => 'a';`,
						},
					],
				},
			],
		},
		{
			code: `export = {
	value: 'a',
};`,
			errors: [
				{
					column: 1,
					endColumn: 3,
					endLine: 3,
					line: 1,
					messageId: "exportAlias",
					suggestions: [
						{
							messageId: "exportAliasDefaultFix",
							output: `export default {
	value: 'a',
};`,
						},
					],
				},
			],
		},
	],
	valid: [
		`export default values;`,
		`export { values };`,
		`export as namespace Values;`,
		`import values = require('values');`,
		`
			declare module 'values' {
				export = values;
			}
		`,
		`
			declare global {
				export = values;
			}
		`,
	],
});
