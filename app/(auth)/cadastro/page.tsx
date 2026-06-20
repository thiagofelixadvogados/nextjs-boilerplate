"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Field, Input, Select } from "@/components/ui";
import { useApp } from "@/lib/store";
import { maskCNPJ, maskCPF, maskPhone } from "@/lib/format";
import type { Partner } from "@/lib/types";

const stepNames = ["Empresa", "Sócios", "Bancário", "Acesso"];

export default function Cadastro() {
  const { registerClient, toast } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const [empresa, setEmpresa] = useState({
    razaoSocial: "", nomeFantasia: "", cnpj: "", inscricaoEstadual: "",
    endereco: "", cidade: "", estado: "", cep: "", telefone: "", site: "",
    faturamentoMensal: "", volumeRecebiveis: "", segmento: "",
  });
  const [socios, setSocios] = useState<Partner[]>([
    { nome: "", cpf: "", rg: "", nascimento: "", telefone: "", email: "", percentual: 100 },
  ]);
  const [banco, setBanco] = useState({ banco: "", agencia: "", conta: "", pix: "", titularidade: "" });
  const [acesso, setAcesso] = useState({ email: "", password: "", confirm: "" });

  const setE = (k: string, v: string) => setEmpresa((s) => ({ ...s, [k]: v }));
  const setS = (i: number, k: keyof Partner, v: string | number) =>
    setSocios((arr) => arr.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));
  const setB = (k: string, v: string) => setBanco((s) => ({ ...s, [k]: v }));
  const setA = (k: string, v: string) => setAcesso((s) => ({ ...s, [k]: v }));

  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!empresa.razaoSocial || !empresa.cnpj || !empresa.cidade) {
        setError("Preencha razão social, CNPJ e cidade."); return false;
      }
    }
    if (step === 1) {
      if (socios.some((s) => !s.nome || !s.cpf)) {
        setError("Informe nome e CPF de cada sócio."); return false;
      }
    }
    if (step === 3) {
      if (!acesso.email || !acesso.password) { setError("Informe e-mail e senha."); return false; }
      if (acesso.password.length < 6) { setError("A senha deve ter ao menos 6 caracteres."); return false; }
      if (acesso.password !== acesso.confirm) { setError("As senhas não coincidem."); return false; }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 3)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    if (!validateStep()) return;
    const res = registerClient({
      email: acesso.email,
      password: acesso.password,
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia || empresa.razaoSocial,
      cnpj: empresa.cnpj,
      inscricaoEstadual: empresa.inscricaoEstadual,
      endereco: empresa.endereco,
      cidade: empresa.cidade,
      estado: empresa.estado,
      cep: empresa.cep,
      telefone: empresa.telefone,
      site: empresa.site,
      faturamentoMensal: Number(empresa.faturamentoMensal) || 0,
      volumeRecebiveis: Number(empresa.volumeRecebiveis) || 0,
      segmento: empresa.segmento,
      socios,
      banco,
    });
    if (!res.ok) { setError(res.error || "Erro ao cadastrar."); return; }
    toast("Cadastro criado! Bem-vindo à Fluxo Prime.", "success");
    router.push("/app/dashboard");
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-navy-900">Criar cadastro</h1>
      <p className="mt-2 text-sm text-muted">Cadastro único da sua empresa para operar.</p>

      {/* stepper */}
      <div className="mt-6 flex items-center gap-2">
        {stepNames.map((n, i) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${i <= step ? "bg-navy-900 text-gold-300" : "bg-line text-muted"}`}>{i + 1}</span>
            <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-navy-900" : "text-muted"}`}>{n}</span>
            {i < stepNames.length - 1 && <span className={`h-0.5 flex-1 ${i < step ? "bg-navy-900" : "bg-line"}`} />}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Razão social" required><Input value={empresa.razaoSocial} onChange={(e) => setE("razaoSocial", e.target.value)} /></Field></div>
            <Field label="Nome fantasia"><Input value={empresa.nomeFantasia} onChange={(e) => setE("nomeFantasia", e.target.value)} /></Field>
            <Field label="CNPJ" required><Input value={empresa.cnpj} onChange={(e) => setE("cnpj", maskCNPJ(e.target.value))} placeholder="00.000.000/0000-00" /></Field>
            <Field label="Inscrição estadual"><Input value={empresa.inscricaoEstadual} onChange={(e) => setE("inscricaoEstadual", e.target.value)} /></Field>
            <Field label="Segmento de atuação"><Input value={empresa.segmento} onChange={(e) => setE("segmento", e.target.value)} placeholder="Ex.: Distribuição" /></Field>
            <div className="sm:col-span-2"><Field label="Endereço"><Input value={empresa.endereco} onChange={(e) => setE("endereco", e.target.value)} /></Field></div>
            <Field label="Cidade" required><Input value={empresa.cidade} onChange={(e) => setE("cidade", e.target.value)} /></Field>
            <Field label="Estado"><Input value={empresa.estado} onChange={(e) => setE("estado", e.target.value.toUpperCase().slice(0, 2))} placeholder="UF" /></Field>
            <Field label="CEP"><Input value={empresa.cep} onChange={(e) => setE("cep", e.target.value)} /></Field>
            <Field label="Telefone"><Input value={empresa.telefone} onChange={(e) => setE("telefone", maskPhone(e.target.value))} /></Field>
            <Field label="Site"><Input value={empresa.site} onChange={(e) => setE("site", e.target.value)} /></Field>
            <Field label="Faturamento mensal (R$)"><Input type="number" value={empresa.faturamentoMensal} onChange={(e) => setE("faturamentoMensal", e.target.value)} /></Field>
            <Field label="Volume médio de recebíveis (R$)"><Input type="number" value={empresa.volumeRecebiveis} onChange={(e) => setE("volumeRecebiveis", e.target.value)} /></Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            {socios.map((s, i) => (
              <div key={i} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900">Sócio {i + 1}</p>
                  {socios.length > 1 && (
                    <button onClick={() => setSocios((arr) => arr.filter((_, idx) => idx !== i))} className="text-xs text-red-600 hover:underline">Remover</button>
                  )}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Nome" required><Input value={s.nome} onChange={(e) => setS(i, "nome", e.target.value)} /></Field>
                  <Field label="CPF" required><Input value={s.cpf} onChange={(e) => setS(i, "cpf", maskCPF(e.target.value))} /></Field>
                  <Field label="RG"><Input value={s.rg} onChange={(e) => setS(i, "rg", e.target.value)} /></Field>
                  <Field label="Data de nascimento"><Input type="date" value={s.nascimento} onChange={(e) => setS(i, "nascimento", e.target.value)} /></Field>
                  <Field label="Telefone"><Input value={s.telefone} onChange={(e) => setS(i, "telefone", maskPhone(e.target.value))} /></Field>
                  <Field label="E-mail"><Input type="email" value={s.email} onChange={(e) => setS(i, "email", e.target.value)} /></Field>
                  <Field label="Percentual societário (%)"><Input type="number" value={s.percentual} onChange={(e) => setS(i, "percentual", Number(e.target.value))} /></Field>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setSocios((arr) => [...arr, { nome: "", cpf: "", rg: "", nascimento: "", telefone: "", email: "", percentual: 0 }])}>
              + Adicionar sócio
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Banco"><Select value={banco.banco} onChange={(e) => setB("banco", e.target.value)}>
              <option value="">Selecione</option>
              {["Banco do Brasil (001)", "Bradesco (237)", "Caixa (104)", "Itaú (341)", "Santander (033)", "Nubank (260)", "Inter (077)", "Sicoob (756)"].map((b) => <option key={b}>{b}</option>)}
            </Select></Field>
            <Field label="Agência"><Input value={banco.agencia} onChange={(e) => setB("agencia", e.target.value)} /></Field>
            <Field label="Conta"><Input value={banco.conta} onChange={(e) => setB("conta", e.target.value)} /></Field>
            <Field label="Chave Pix"><Input value={banco.pix} onChange={(e) => setB("pix", e.target.value)} /></Field>
            <div className="sm:col-span-2"><Field label="Titularidade"><Input value={banco.titularidade} onChange={(e) => setB("titularidade", e.target.value)} placeholder="Deve coincidir com a razão social" /></Field></div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4">
            <Field label="E-mail de acesso" required><Input type="email" value={acesso.email} onChange={(e) => setA("email", e.target.value)} /></Field>
            <Field label="Senha" required hint="Mínimo 6 caracteres"><Input type="password" value={acesso.password} onChange={(e) => setA("password", e.target.value)} /></Field>
            <Field label="Confirmar senha" required><Input type="password" value={acesso.confirm} onChange={(e) => setA("confirm", e.target.value)} /></Field>
            <p className="text-xs text-muted">Ao criar o cadastro você concorda com os <Link href="/termos" className="text-gold-600 underline">Termos de Uso</Link> e a <Link href="/privacidade" className="text-gold-600 underline">Política de Privacidade</Link>. Documentos serão solicitados na Área do Cliente.</p>
          </div>
        )}

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="flex gap-3 pt-2">
          {step > 0 && <Button variant="outline" onClick={back} className="flex-1">Voltar</Button>}
          {step < 3 ? (
            <Button variant="gold" onClick={next} className="flex-1">Continuar</Button>
          ) : (
            <Button variant="gold" onClick={submit} className="flex-1">Criar cadastro</Button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta? <Link href="/login" className="font-semibold text-navy-900 hover:underline">Entrar</Link>
      </p>
    </div>
  );
}
