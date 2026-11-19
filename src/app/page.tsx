import { t } from "@/i18n";

// Entrada pública mínima: estática, sem banco, sessão ou rede.
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title">{t("home.title")}</h1>
      <p>{t("home.lead")}</p>
      <p className="muted">{t("home.body")}</p>
    </section>
  );
}
