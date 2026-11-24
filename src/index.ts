import Module from "node:module";

import { rules } from "./rules/index.ts";

const require = Module.createRequire(import.meta.url);

const { name, version } =
	// `import`ing here would bypass the TSConfig's `"rootDir": "src"`
	require("../package.json") as typeof import("../package.json");

export const plugin = {
	configs: {
		get recommended() {
			return recommended;
		},
	},
	meta: { name, version },
	rules,
};

const recommended = {
	plugins: {
		"erasable-syntax-only": plugin,
	},
	rules: Object.fromEntries(
		Object.keys(rules).map((rule) => [
			`erasable-syntax-only/${rule}`,
			"error" as const,
		]),
	),
};

export { plugin as default, rules };
