import { useTranslations } from "next-intl";

export type Faq = {
  q: string;
  keywords: string[];
  a: string;
};

/** Single source of truth for FAQs: rendered in the Faq section and used by
 * the ChatWidget. Content lives in messages/{locale}.json under `faq.items`
 * (kept in sync with the FAQPage JSON-LD emitted in the root layout). */
export function useFaqs(): Faq[] {
  const t = useTranslations("faq");
  return t.raw("items") as Faq[];
}
