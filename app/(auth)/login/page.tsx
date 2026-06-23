"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Field, Input } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const { login, toast } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error || "Não foi possível entrar.");
      return;
    }
    toast("Bem-vindo de volta!", "success");
    const isAdmin = email.trim().toLowerCase() === "admin@newcapital.com";
    router.push(isAdmin ? "/admin" : "/app/dashboard");
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-navy-900">Entrar</h1>
      <p className="mt-2 text-sm text-muted">Acesse o portal da New Capital Fomento.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="E-mail" required>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" autoComplete="email" />
        </Field>
        <Field label="Senha" required error={error}>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
        </Field>
        <div className="flex justify-end">
          <Link href="/recuperar-senha" className="text-sm font-medium text-gold-600 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" variant="gold" size="lg" className="w-full">Entrar</Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Não tem cadastro?{" "}
        <Link href="/cadastro" className="font-semibold text-navy-900 hover:underline">Criar agora</Link>
      </p>
    </div>
  );
}
