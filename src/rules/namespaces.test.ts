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
