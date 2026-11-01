import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
          <span className="text-primary">●</span> Asahi · 管理
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Panel interno</h1>
        <LoginForm />
      </div>
    </main>
  );
}
