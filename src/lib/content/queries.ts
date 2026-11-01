import { getTranslations } from "next-intl/server";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-admin";
import { projectImage } from "./local-images";
import type { ProjectRow, PublicProject, PublicTestimonial, TestimonialRow } from "./types";

type Locale = "es" | "en";

export async function listProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("asahi_projects")
    .select("*")
    .order("sort_order")
    .order("created_at");
  if (error) throw new Error(error.message);
  return data as ProjectRow[];
}

export async function listTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("asahi_testimonials")
    .select("*")
    .order("sort_order")
    .order("created_at");
  if (error) throw new Error(error.message);
  return data as TestimonialRow[];
}

const FALLBACK_PROJECTS = [
  { slug: "campo", url: "https://campo-nsn.gov/", hue: "oklch(0.55 0.14 140)" },
  { slug: "emika", url: "https://www.emika-procleaning.com/", hue: "oklch(0.6 0.18 250)" },
  { slug: "beauty", url: "https://thebeautyhealth.mx/", hue: "oklch(0.7 0.14 60)" },
  { slug: "china", url: "https://china-sourcing.webflow.io/", hue: "oklch(0.62 0.235 27)" },
];
const FALLBACK_TESTIMONIALS = ["mariana", "daniel", "lucia", "roberto"];

// Si Supabase no está configurado o falla, el sitio sigue mostrando el contenido de messages/*.json.
export async function getPublicProjects(locale: Locale): Promise<PublicProject[]> {
  if (isSupabaseConfigured()) {
    try {
      const rows = (await listProjects()).filter((r) => r.visible);
      return rows.map((r) => ({
        key: r.id,
        title: r[`title_${locale}`],
        tag: r[`tag_${locale}`],
        metric: r[`metric_${locale}`],
        url: r.url,
        hue: r.hue,
        image: projectImage(r),
      }));
    } catch (e) {
      console.error("[content] projects fallback:", e);
    }
  }
  const t = await getTranslations({ locale, namespace: "work.projects" });
  return FALLBACK_PROJECTS.map((p) => ({
    key: p.slug,
    title: t(`${p.slug}.title`),
    tag: t(`${p.slug}.tag`),
    metric: t(`${p.slug}.metric`),
    url: p.url,
    hue: p.hue,
    image: projectImage({ slug: p.slug, image_url: null }),
  }));
}

export async function getPublicTestimonials(locale: Locale): Promise<PublicTestimonial[]> {
  if (isSupabaseConfigured()) {
    try {
      const rows = (await listTestimonials()).filter((r) => r.visible);
      return rows.map((r) => ({
        key: r.id,
        quote: r[`quote_${locale}`],
        name: r.name,
        role: r[`role_${locale}`],
        company: r.company,
        jp: r.jp,
      }));
    } catch (e) {
      console.error("[content] testimonials fallback:", e);
    }
  }
  const t = await getTranslations({ locale, namespace: "testimonials.items" });
  return FALLBACK_TESTIMONIALS.map((k) => ({
    key: k,
    quote: t(`${k}.quote`),
    name: t(`${k}.name`),
    role: t(`${k}.role`),
    company: t(`${k}.company`),
    jp: t(`${k}.jp`),
  }));
}
