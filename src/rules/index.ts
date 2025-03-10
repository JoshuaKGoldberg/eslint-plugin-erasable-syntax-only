import { rule as enums } from "./enums.js";
import { rule as importAliases } from "./import-aliases.js";
import { rule as namespaces } from "./namespaces.js";
import { rule as parameterProperties } from "./parameter-properties.js";

export const rules = {
	enums,
	"import-aliases": importAliases,
	namespaces,
	"parameter-properties": parameterProperties,
};
