import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono, Noto_Serif_JP } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MotionConfig } from "framer-motion";
import { Preloader } from "@/components/asahi/Preloader";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const SITE_URL = "https://asahistudio.lat";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const path = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const url = `${SITE_URL}${path}`;
  const ogLocale = locale === "es" ? "es_MX" : "en_US";

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Asahi Studio" }],
    robots: "index, follow, max-image-preview:large, max-snippet:-1",
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/es`,
      },
    },
    other: {
      "geo.region": "MX",
      "geo.placename": "Ciudad de México, Guadalajara",
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Asahi Studio",
      locale: ogLocale,
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: `${SITE_URL}/Identidad/Asahi-open-graph.webp`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: [`${SITE_URL}/Identidad/Asahi-open-graph.webp`],
    },
    icons: {
      icon: "/Identidad/favicon.svg",
    },
  };
}

function StructuredData({ locale }: { locale: string }) {
  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "Asahi Studio",
    alternateName: "朝日スタジオ",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/Identidad/favicon.svg`,
    image: `${SITE_URL}/Identidad/Asahi-open-graph.webp`,
    description:
      locale === "es"
        ? "Estudio de diseño y desarrollo web en México. Landing pages de alta conversión, e-commerce escalable y automatizaciones con inteligencia artificial."
        : "A web design and development studio in Mexico. High-conversion landing pages, scalable e-commerce and AI-driven automations.",
    email: "hola@asahi.studio",
    priceRange: "$120 - $1,000+ USD",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad de México",
      addressCountry: "MX",
    },
    areaServed: ["MX", "US", "Latinoamérica"],
    knowsLanguage: ["es", "en"],
    slogan: locale === "es" ? "Landing pages que convierten" : "Landing pages that convert",
    makesOffer: [
      {
        "@type": "Offer",
        name: "Landing Express",
        description:
          locale === "es"
            ? "Landing page profesional enfocada en una oferta, entrega en 3 a 5 días hábiles."
            : "Professional single-offer landing page, delivered in 3 to 5 business days.",
        priceCurrency: "USD",
        price: "120",
      },
      {
        "@type": "Offer",
        name: "Growth",
        description:
          locale === "es"
            ? "Landing page con casos de éxito, FAQs, test A/B e integración con email marketing."
            : "Landing page with case studies, FAQs, A/B testing and email marketing integration.",
        priceCurrency: "USD",
        price: "300",
      },
      {
        "@type": "Offer",
        name: "Pro SaaS y Apps",
        description:
          locale === "es"
            ? "Desarrollo en Next.js con APIs, bases de datos, pagos, IA y automatizaciones avanzadas."
            : "Next.js development with APIs, databases, payments, AI and advanced automations.",
        priceCurrency: "USD",
        price: "500",
      },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: "Asahi Studio",
    inLanguage: locale === "es" ? "es-MX" : "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  return (
    <html lang={locale === "es" ? "es-MX" : "en-US"}>
      <head>
        <meta name="theme-color" content="#faf7f0" />
        <StructuredData locale={locale} />
      </head>
      <body
        className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable} ${notoSerifJp.variable}`}
      >
        <NextIntlClientProvider>
          <MotionConfig reducedMotion="user">
            <Preloader />
            {children}
          </MotionConfig>
        </NextIntlClientProvider>
        <noscript>
          <main
            style={{
              maxWidth: 720,
              margin: "4rem auto",
              padding: "0 1.5rem",
              fontFamily: "system-ui,sans-serif",
            }}
          >
            <h1>{t("noscriptTitle")}</h1>
            <p>{t("noscriptBody")}</p>
            <p>
              {t("noscriptContact")}: <a href="mailto:hola@asahi.studio">hola@asahi.studio</a>
            </p>
          </main>
        </noscript>
      </body>
    </html>
  );
}
