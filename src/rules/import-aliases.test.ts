import { rule } from "./import-aliases.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.run("import-aliases", rule, {
	invalid: [
		{
			code: `import values = require("values");`,
			errors: [
				{
					column: 1,
					endColumn: 35,
					endLine: 1,
					line: 1,
					messageId: "importAlias",
					suggestions: [
						{
							messageId: "importAliasDefaultFix",
							output: `import values from "values";`,
						},
						{
							messageId: "importAliasNamespaceFix",
							output: `import * as values from "values";`,
						},
					],
				},
			],
		},
	],
	valid: [`import values from "values";`, `import values = Values;`],
});
