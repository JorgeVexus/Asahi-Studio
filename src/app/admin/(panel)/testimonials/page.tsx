import Link from "next/link";
import { listTestimonials } from "@/lib/content/queries";
import { isSupabaseConfigured } from "@/lib/supabase-admin";

export default async function TestimonialsPage() {
  const rows = isSupabaseConfigured() ? await listTestimonials() : [];
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Testimonios</h1>
        <Link
          href="/admin/testimonials/new"
          className="border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:border-primary hover:bg-primary"
        >
          + Nuevo
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-foreground/15 border-y border-foreground/15">
        {rows.map((r) => (
          <li key={r.id}>
            <Link
              href={`/admin/testimonials/${r.id}`}
              className="flex items-center gap-4 py-4 hover:bg-foreground/5"
            >
              <span className="w-8 text-center font-jp text-2xl text-foreground/30">{r.jp}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">
                  {r.name} <span className="font-normal text-foreground/50">· {r.company}</span>
                </span>
                <span className="block truncate text-sm text-foreground/60">{r.quote_es}</span>
              </span>
              {!r.visible && (
                <span className="font-mono text-[11px] uppercase text-foreground/50">Oculto</span>
              )}
              <span className="text-foreground/40">→</span>
            </Link>
          </li>
        ))}
        {rows.length === 0 && <li className="py-8 text-sm text-foreground/60">Sin testimonios.</li>}
      </ul>
    </>
  );
}
