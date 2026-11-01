import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-7xl italic text-foreground">{t("title")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("body")}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-none border border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-primary hover:border-primary"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
