import Link from "next/link";
import { t } from "@/i18n";

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <h1 id="not-found-title">{t("notFound.title")}</h1>
      <p>{t("notFound.body")}</p>
      <Link href="/">{t("notFound.back")}</Link>
    </section>
  );
}
