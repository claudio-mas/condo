import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Fronteira do domínio: src/domain é puro (sem banco, servidor, autenticação,
// React, catálogo de mensagens, telas ou serviços).
const domainForbiddenImports = [
  {
    group: [
      "next",
      "next/*",
      "react",
      "react/*",
      "react-dom",
      "react-dom/*",
      "server-only",
      "pg",
      "pg/*",
      "drizzle-orm",
      "drizzle-orm/*",
      "drizzle-kit",
      "better-auth",
      "better-auth/*",
      "@better-auth/*",
      "@aws-sdk/*",
      "sharp",
      "nodemailer",
      "pdf-lib",
      "@pdf-lib/*",
      "node:*",
      "@/i18n",
      "@/i18n/*",
      "@/app",
      "@/app/*",
      "@/server",
      "@/server/*",
      "@/components",
      "@/components/*",
      "**/i18n",
      "**/i18n/*",
      "**/app/*",
      "**/server/*",
      "**/components/*",
    ],
    message:
      "src/domain não importa banco, servidor, autenticação, React, catálogo i18n nem telas.",
  },
];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: domainForbiddenImports }],
    },
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    // Ferramentas de agentes e materiais fora da aplicação.
    ".agents/**",
    ".claude/**",
    ".codex/**",
    ".maestri/**",
    ".oil-ui/**",
    ".aws/**",
    "landing-beta/**",
    "docs/**",
  ]),
]);
