"use client";

import { t } from "@/i18n";

// Limite de erro recuperável: nunca exibe mensagem, stack ou dados técnicos.
// O `digest` é apenas um código de ocorrência para correlação nos registros do servidor.
export default function ErrorBoundary({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <section aria-labelledby="error-title" role="alert">
      <h1 id="error-title">{t("error.title")}</h1>
      <p>{t("error.body")}</p>
      {error.digest ? <p className="muted">{t("error.occurrence", { code: error.digest })}</p> : null}
      <button type="button" onClick={reset}>
        {t("error.retry")}
      </button>
    </section>
  );
}
