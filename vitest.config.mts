import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": fileURLToPath(
        new URL("./tests/support/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    clearMocks: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    restoreMocks: true,
    unstubEnvs: true,
  },
});
