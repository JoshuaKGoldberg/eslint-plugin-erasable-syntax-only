import Module from "node:module";

import { rules } from "./rules/index.js";

// TODO: Eventually we'll just drop support for CJS.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
const require = Module.createRequire(import.meta.url);

const { name, version } =
	// `import`ing here would bypass the TSConfig's `"rootDir": "src"`
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
		Object.keys(rules).map((rule) => [`erasable-syntax-only/${rule}`, "error"]),
	),
};

export { plugin as default, rules };
