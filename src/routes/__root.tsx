import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import appCss from "../styles.css?url";
import { Preloader } from "../components/asahi/Preloader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          404 — 迷子
        </p>
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
  // Static SEO tags (og, twitter, JSON-LD, fonts) live in index.html — the
  // single source of truth crawlers see before JS runs. Only the dynamic
  // bits belong here to avoid duplicated meta tags.
  head: () => ({
    meta: [
      { title: "Asahi Studio | Diseño y Desarrollo Web en México — Landing Pages que Convierten" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://asahistudio.lat/" },
    ],
  }),
  shellComponent: RootShell,
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <HeadContent />
      <Preloader />
      {children}
      <Scripts />
    </MotionConfig>
  );
}
