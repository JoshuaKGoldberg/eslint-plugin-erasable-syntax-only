import type { KnipConfig } from "knip";

export default {
	entry: ["src/**/*.test.*"],
	ignoreExportsUsedInFile: { interface: true, type: true },
	project: ["!src/rules/ruleTester.ts!", "src/**/*.ts!"],
	treatConfigHintsAsErrors: true,
} satisfies KnipConfig;
