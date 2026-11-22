import { rule as enums } from "./enums.ts";
import { rule as exportAliases } from "./export-aliases.ts";
import { rule as importAliases } from "./import-aliases.ts";
import { rule as namespaces } from "./namespaces.ts";
import { rule as parameterProperties } from "./parameter-properties.ts";

export const rules = {
	enums,
	"export-aliases": exportAliases,
	"import-aliases": importAliases,
	namespaces,
	"parameter-properties": parameterProperties,
};
