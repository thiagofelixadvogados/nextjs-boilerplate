"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Field, Input } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function RecuperarSenha() {
  const { toast } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast("Informe seu e-mail.", "error");
      return;
    }
    setSent(true);
    toast("Se o e-mail existir, enviaremos as instruções.", "info");
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-navy-900">Recuperar senha</h1>
      <p className="mt-2 text-sm text-muted">Enviaremos instruções de redefinição para o seu e-mail.</p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <span className="grid mx-auto h-12 w-12 place-items-center rounded-2xl bg-white text-2xl text-emerald-600">✓</span>
          <p className="mt-3 font-semibold text-navy-900">Instruções enviadas</p>
          <p className="mt-1 text-sm text-muted">Verifique a caixa de entrada de <strong>{email}</strong>. (Demonstrativo — nenhum e-mail real é enviado.)</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Field label="E-mail" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" />
          </Field>
          <Button type="submit" variant="gold" size="lg" className="w-full">Enviar instruções</Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-semibold text-navy-900 hover:underline">Voltar ao login</Link>
      </p>
    </div>
  );
}
