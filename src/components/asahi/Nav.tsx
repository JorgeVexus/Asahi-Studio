export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative inline-block h-3.5 w-3.5 rounded-full bg-primary" />
          <span className="font-display text-xl tracking-tight">Asahi<span className="italic text-primary">.</span></span>
          <span className="font-jp text-xs text-muted-foreground hidden sm:inline">朝日</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {[
            ["Servicios", "#services"],
            ["Proceso", "#process"],
            ["Trabajo", "#work"],
            ["Contacto", "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-foreground/70 transition hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="group inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-primary hover:border-primary"
        >
          Empezar proyecto
          <span className="transition group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </header>
  );
}
