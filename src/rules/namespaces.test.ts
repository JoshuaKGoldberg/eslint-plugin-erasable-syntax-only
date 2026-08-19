import { rule } from "./namespaces.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.run("namespaces", rule, {
	invalid: [
		{
			code: `
				module Values {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					const value = 'a';
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					value: 'a',
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					const value = 'a';
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					value: 'a',
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				export namespace Values {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 12,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					export const value = 'a';
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				export const Values = {
					value: 'a',
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export const value: string = 'a';
					export let other = 'b', third = 'c';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 5,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					const value: string = 'a';
					let other = 'b', third = 'c';
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					value: 'a',
					other: 'b', third: 'c',
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export function value() {}
					export async function asynchronous() {}
					export function* generator() {}
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 6,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					function value() {}
					async function asynchronous() {}
					function* generator() {}
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					value() {},
					async asynchronous() {},
					* generator() {},
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export const value = 'a';
					export function getValue() {
						return value;
					}
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 7,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					const value = 'a';
					function getValue() {
						return value;
					}
				
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export const a = 'a';
					export const b = Values.a;
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 5,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Values {
					const hidden = 'a';
					export const value = 'b';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 5,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Values {
					export namespace Inner {
						export const value = 'a';
					}
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 6,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Value {
					export class A { }
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				module Values.Inner {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				export module Values.Inner {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 12,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Values.Inner {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				export namespace Values.Inner {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 12,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Value {
					export function a(): void;
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Declared {
					export declare class A { }
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Value {
					export enum A { }
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Declared {
					export declare function a(): void;
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Declared {
					export declare enum A { }
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Declared {
					export declare const a: 'a';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Invalid {
					export {};
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				const a = 'a';
				namespace Invalid {
					export { a };
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 5,
					line: 3,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Values {
					export const value = 'a';
				}
				
				console.log(Values.value);
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					value: 'a',
				};
				
				console.log(Values.value);
			`,
						},
					],
				},
			],
		},
		{
			code: `
				export namespace Values {
					export const value = 'a';
				}
				
				console.log(Values.value);
			`,
			errors: [
				{
					column: 12,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceObjectFix",
							output: `
				export const Values = {
					value: 'a',
				};
				
				console.log(Values.value);
			`,
						},
					],
				},
			],
		},
		{
			code: `
				const value = 'outer';
				namespace Values {
					export const value = 'inner';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 5,
					line: 3,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceObjectFix",
							output: `
				const value = 'outer';
				const Values = {
					value: 'inner',
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export let value = 'a';
				}
				
				Values.value = 'b';
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					value: 'a',
				};
				
				Values.value = 'b';
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export const a = 'a'
					export const b = 'b'
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 5,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					const a = 'a'
					const b = 'b'
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					a: 'a',
					b: 'b',
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					// Leading.
					export const a = 'a'; // Trailing.
					/* Block. */
					export const b = 'b';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 7,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					// Leading.
					const a = 'a'; // Trailing.
					/* Block. */
					const b = 'b';
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					// Leading.
					a: 'a', // Trailing.
					/* Block. */
					b: 'b',
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				function make() {
					namespace Values {
						export const value = 'a';
					}
				}
			`,
			errors: [
				{
					column: 6,
					endColumn: 7,
					endLine: 5,
					line: 3,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				function make() {
					
						const value = 'a';
					
				}
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				function make() {
					const Values = {
						value: 'a',
					};
				}
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export const value: readonly string[] = [];
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					const value: readonly string[] = [];
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					value: [],
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export const run = async () => {};
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
					suggestions: [
						{
							messageId: "namespaceRemoveFix",
							output: `
				
					const run = async () => {};
				
			`,
						},
						{
							messageId: "namespaceObjectFix",
							output: `
				const Values = {
					run: async () => {},
				};
			`,
						},
					],
				},
			],
		},
		{
			code: `
				namespace Values {
					export const a = 'a';
				}
				namespace Values {
					export const b = 'b';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
				{
					column: 5,
					endColumn: 6,
					endLine: 7,
					line: 5,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				function Values() {}
				namespace Values {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 5,
					line: 3,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				interface Values {
					a: string;
				}
				namespace Values {
					export const value = 'a';
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 7,
					line: 5,
					messageId: "namespace",
				},
			],
		},
		{
			code: `
				namespace Values {
					export const { value } = source;
				}
			`,
			errors: [
				{
					column: 5,
					endColumn: 6,
					endLine: 4,
					line: 2,
					messageId: "namespace",
				},
			],
		},
	],
	valid: [
		`const Values = {};`,
		`module 'values' {}`,
		`module Empty {}`,
		`namespace Empty {}`,
		`export namespace Empty {}`,
		`
			namespace Empty {}
			export {};
		`,
		`
			namespace Types {
				interface A {}
			}
		`,
		`
			namespace Types {
				declare interface A {}
			}
		`,
		`
			namespace Types {
				export interface A {}
			}
		`,
		`
			namespace Types {
				export declare interface A {}
			}
		`,
		`
			namespace Types {
				type A = 'a';
			}
		`,
		`
			namespace Types {
				declare type A = 'a';
			}
		`,
		`
			namespace Types {
				export type A = 'a';
			}
		`,
		`
			namespace Types {
				export declare type A = 'a';
			}
		`,
		`declare module Empty {}`,
		`declare namespace Empty {}`,
		`
			namespace NotInstantiated {
				export interface JustAType { }
				export type ATypeInANamespace = {};
				namespace Nested {
					export type ATypeInANamespace = {};
				}
			}
		`,
		`
			declare namespace AmbientIsNotInstantiated {
				export const stillOk = 12;
			}
		`,
		`
			declare namespace AmbientStuff {
				namespace Nested {
					export const stillOk = 12;
				}
				enum EnumInAmbientContext {
					B = 1
				}
			
				import FineAlias = EnumInAmbientContext.B;
			}
		`,
		`
			declare namespace AmbientStuff {
				export namespace Nested {
					export const stillOk = 12;
				}
				enum EnumInAmbientContext {
					B = 1
				}
			
				import FineAlias = EnumInAmbientContext.B;
			}
		`,
	],
});
