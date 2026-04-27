"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">Cargando...</main>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
              emailRedirectTo: `${window.location.origin}/dashboard`
            }
          });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Cuenta creada. Revisa tu correo para confirmar el acceso.");
      return;
    }

    window.location.href = redirectTo;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">APP Ganadera</p>
          <CardTitle>{mode === "login" ? "Ingresar" : "Crear cuenta"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Nombre completo"
                required
              />
            )}
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Correo"
              autoComplete="email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contrasena"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
            {message && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Procesando..." : mode === "login" ? "Ingresar" : "Crear cuenta"}
            </Button>
          </form>
          <Button
            type="button"
            variant="ghost"
            className="mt-3 w-full"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {mode === "login" ? "Crear cuenta nueva" : "Ya tengo cuenta"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
