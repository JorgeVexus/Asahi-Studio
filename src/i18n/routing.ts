import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  // Siempre abrir en español en "/"; el inglés solo se elige con el selector o con /en.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
