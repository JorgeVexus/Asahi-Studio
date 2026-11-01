import Link from "next/link";
import { logout } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/15 pb-5">
        <nav className="flex items-center gap-6 text-sm">
          <span className="font-display text-xl font-semibold">Asahi · 管理</span>
          <Link href="/admin/projects" className="hover:text-primary">
            Proyectos
          </Link>
          <Link href="/admin/testimonials" className="hover:text-primary">
            Testimonios
          </Link>
          <a href="/es" target="_blank" className="text-foreground/50 hover:text-primary">
            Ver sitio ↗
          </a>
        </nav>
        <form action={logout}>
          <button className="text-sm text-foreground/60 hover:text-primary">Salir</button>
        </form>
      </header>
      {!isSupabaseConfigured() && (
        <p className="mt-6 border border-primary/50 bg-primary/10 p-4 text-sm">
          Supabase no está configurado (faltan <code>SUPABASE_URL</code> y{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>). El sitio muestra el contenido por defecto y no se
          puede editar.
        </p>
      )}
      <main className="py-8">{children}</main>
    </div>
  );
}
