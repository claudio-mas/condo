import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes de integração: execução explícita, somente contra o banco de teste
// (TEST_DATABASE_URL). O setup verifica o destino antes de migrar ou limpar dados.
export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./src/", import.meta.url)) }],
  },
  test: {
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["./tests/support/setup-integration.ts"],
    environment: "node",
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
