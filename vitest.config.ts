import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			exclude: ["src/index.ts", "src/rules/index.ts"],
			include: ["src"],
			reporter: ["html", "lcov"],
		},
		exclude: ["dist", "lib", "node_modules"],
		setupFiles: ["console-fail-test/setup"],
	},
});
