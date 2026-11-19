import { defineConfig } from "drizzle-kit";

// Usado apenas pelos comandos explícitos `npm run db:generate` e `npm run db:migrate`.
// A aplicação nunca aplica migrações ao iniciar.
const url = process.env.DATABASE_URL;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema",
  out: "./drizzle",
  strict: true,
  verbose: true,
  ...(url ? { dbCredentials: { url } } : {}),
});
