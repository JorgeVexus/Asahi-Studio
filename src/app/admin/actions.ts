"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  SESSION_SECONDS,
  createSessionToken,
  passwordMatches,
  verifySessionToken,
} from "@/lib/admin-auth";
import { IMAGE_BUCKET, supabaseAdmin } from "@/lib/supabase-admin";

export type ActionState = { error?: string } | undefined;

async function requireAdmin() {
  const jar = await cookies();
  if (!(await verifySessionToken(jar.get(ADMIN_COOKIE)?.value))) {
    redirect("/admin/login");
  }
}

function revalidateSite() {
  revalidatePath("/es");
  revalidatePath("/en");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

// ---------- Sesión ----------
export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return { error: "Faltan ADMIN_PASSWORD / ADMIN_SESSION_SECRET en las variables de entorno." };
  }
  if (!(await passwordMatches(String(fd.get("password") ?? "")))) {
    await new Promise((r) => setTimeout(r, 1000)); // frena fuerza bruta
    return { error: "Contraseña incorrecta." };
  }
  const token = await createSessionToken();
  if (!token) return { error: "ADMIN_SESSION_SECRET debe tener al menos 32 caracteres." };
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---------- Proyectos ----------
async function uploadImage(file: File): Promise<string> {
  const allowed = ["image/webp", "image/png", "image/jpeg", "image/avif"];
  if (!allowed.includes(file.type)) throw new Error("La imagen debe ser WebP, PNG, JPG o AVIF.");
  if (file.size > 4 * 1024 * 1024) throw new Error("La imagen pesa más de 4 MB.");
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const sb = supabaseAdmin();
  const { error } = await sb.storage
    .from(IMAGE_BUCKET)
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
  if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);
  return sb.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function saveProject(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  const url = str(fd, "url");
  if (!/^https?:\/\//i.test(url)) return { error: "La URL debe empezar con http:// o https://" };
  if (!str(fd, "title_es") || !str(fd, "title_en"))
    return { error: "El título es obligatorio en ES y EN." };

  const row: Record<string, unknown> = {
    url,
    hue: str(fd, "hue") || "oklch(0.62 0.235 27)",
    sort_order: Number(fd.get("sort_order")) || 0,
    visible: fd.get("visible") === "on",
    title_es: str(fd, "title_es"),
    title_en: str(fd, "title_en"),
    tag_es: str(fd, "tag_es"),
    tag_en: str(fd, "tag_en"),
    metric_es: str(fd, "metric_es"),
    metric_en: str(fd, "metric_en"),
  };

  try {
    const file = fd.get("image");
    if (file instanceof File && file.size > 0) row.image_url = await uploadImage(file);
    const sb = supabaseAdmin();
    const { error } = id
      ? await sb.from("asahi_projects").update(row).eq("id", id)
      : await sb.from("asahi_projects").insert(row);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al guardar." };
  }
  revalidateSite();
  redirect("/admin/projects");
}

export async function deleteProject(fd: FormData) {
  await requireAdmin();
  await supabaseAdmin().from("asahi_projects").delete().eq("id", str(fd, "id"));
  revalidateSite();
  redirect("/admin/projects");
}

// ---------- Testimonios ----------
export async function saveTestimonial(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  if (!str(fd, "name")) return { error: "El nombre es obligatorio." };
  if (!str(fd, "quote_es") || !str(fd, "quote_en"))
    return { error: "El testimonio es obligatorio en ES y EN." };

  const row = {
    name: str(fd, "name"),
    company: str(fd, "company"),
    jp: str(fd, "jp") || "声",
    sort_order: Number(fd.get("sort_order")) || 0,
    visible: fd.get("visible") === "on",
    quote_es: str(fd, "quote_es"),
    quote_en: str(fd, "quote_en"),
    role_es: str(fd, "role_es"),
    role_en: str(fd, "role_en"),
  };
  const sb = supabaseAdmin();
  const { error } = id
    ? await sb.from("asahi_testimonials").update(row).eq("id", id)
    : await sb.from("asahi_testimonials").insert(row);
  if (error) return { error: error.message };
  revalidateSite();
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(fd: FormData) {
  await requireAdmin();
  await supabaseAdmin().from("asahi_testimonials").delete().eq("id", str(fd, "id"));
  revalidateSite();
  redirect("/admin/testimonials");
}
