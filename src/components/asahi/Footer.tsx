export function Footer() {
  return (
    <footer className="border-t border-foreground/15 bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full bg-primary" />
          <span className="font-display text-lg">Asahi Studio</span>
          <span className="font-jp text-xs text-muted-foreground">朝日</span>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          © 2026 — Diseño + Código + IA · Made in México
        </p>
      </div>
    </footer>
  );
}
