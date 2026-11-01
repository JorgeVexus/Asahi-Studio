"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { SubmitButton, inputCls } from "./ui";

export function LoginForm() {
  const [state, action] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-8 space-y-4">
      <input
        type="password"
        name="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Contraseña"
        className={inputCls}
      />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Entrar</SubmitButton>
    </form>
  );
}
