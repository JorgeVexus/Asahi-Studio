import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Preloader } from "../components/asahi/Preloader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">404 — 迷子</p>
        <h1 className="mt-4 font-display text-7xl italic text-foreground">Lost</h1>
        <p className="mt-3 text-sm text-muted-foreground">Esta página no existe en nuestro mapa.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-none border border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-primary hover:border-primary"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Asahi Studio | Diseño y Desarrollo Web Premium en México" },
      { name: "description", content: "Estudio de diseño y desarrollo web en México. Creamos landing pages de alto impacto, e-commerce escalable y automatizaciones con IA para multiplicar tus ventas." },
      { name: "author", content: "Asahi Studio" },
      { property: "og:title", content: "Asahi Studio | Diseño y Desarrollo Web Premium en México" },
      { property: "og:description", content: "Estudio de diseño y desarrollo web en México. Creamos landing pages de alto impacto, e-commerce escalable y automatizaciones con Inteligencia Artificial." },
      { property: "og:image", content: "/Identidad/Asahi-open-graph.webp" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/Identidad/Asahi-open-graph.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400;1,9..144,800&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+JP:wght@400;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeadContent />
      <Preloader />
      {children}
      <Scripts />
    </>
  );
}
