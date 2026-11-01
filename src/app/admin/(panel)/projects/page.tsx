import Link from "next/link";
import { listProjects } from "@/lib/content/queries";
import { projectImage } from "@/lib/content/local-images";
import { isSupabaseConfigured } from "@/lib/supabase-admin";

export default async function ProjectsPage() {
  const rows = isSupabaseConfigured() ? await listProjects() : [];
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Proyectos</h1>
        <Link
          href="/admin/projects/new"
          className="border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:border-primary hover:bg-primary"
        >
          + Nuevo
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-foreground/15 border-y border-foreground/15">
        {rows.map((r) => (
          <li key={r.id}>
            <Link
              href={`/admin/projects/${r.id}`}
              className="flex items-center gap-4 py-4 hover:bg-foreground/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={projectImage(r)}
                alt=""
                className="h-12 w-20 bg-foreground/10 object-cover object-top"
              />
              <span className="font-mono text-xs text-foreground/50">
                {String(r.sort_order).padStart(2, "0")}
              </span>
              <span className="flex-1 font-medium">{r.title_es}</span>
              {!r.visible && (
                <span className="font-mono text-[11px] uppercase text-foreground/50">Oculto</span>
              )}
              <span className="text-foreground/40">→</span>
            </Link>
          </li>
        ))}
        {rows.length === 0 && <li className="py-8 text-sm text-foreground/60">Sin proyectos.</li>}
      </ul>
    </>
  );
}
