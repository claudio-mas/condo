import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes unitários: sem banco, sem rede; integração e E2E ficam de fora.
export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./src/", import.meta.url)) }],
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    exclude: ["tests/integration/**", "tests/e2e/**", "node_modules/**"],
    environment: "node",
  },
});
