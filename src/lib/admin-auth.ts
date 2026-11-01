// Sesión de admin: cookie firmada con HMAC-SHA256 (Web Crypto, funciona en middleware edge y Node).
export const ADMIN_COOKIE = "asahi_admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

const enc = new TextEncoder();

function b64url(buf: ArrayBuffer) {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(value)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function createSessionToken() {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const sig = await hmac(exp);
  return sig ? `${exp}.${sig}` : null;
}

export async function verifySessionToken(token?: string) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = await hmac(exp);
  return !!expected && safeEqual(sig, expected);
}

export async function passwordMatches(input: string) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  // Se comparan hashes de igual longitud para no filtrar la longitud ni el tiempo.
  const [a, b] = await Promise.all(
    [input, real].map(async (v) => b64url(await crypto.subtle.digest("SHA-256", enc.encode(v)))),
  );
  return safeEqual(a, b);
}
