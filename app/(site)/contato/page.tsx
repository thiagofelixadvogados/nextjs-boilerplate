"use client";

import { useState } from "react";
import { PageHero } from "@/components/site/Pieces";
import { Card, Button, Field, Input, Select, Textarea, Disclaimer } from "@/components/ui";
import { useApp } from "@/lib/store";
import { maskCNPJ, maskPhone } from "@/lib/format";

export default function Contato() {
  const { toast } = useApp();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    nome: "", empresa: "", cnpj: "", telefone: "", email: "",
    cidade: "", estado: "", volume: "", tipo: "convencional", mensagem: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.empresa) {
      toast("Preencha nome, empresa e e-mail.", "error");
      return;
    }
    setSent(true);
    toast("Solicitação enviada! Nossa equipe entrará em contato.", "success");
  };

  return (
    <>
      <PageHero
        eyebrow="Contato"
        title={<>Fale com um <span className="gold-text">especialista.</span></>}
        subtitle="Conte sobre sua empresa e seu volume de recebíveis. Retornamos com a melhor estrutura para o seu caso."
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            <Card className="p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Atendimento</p>
              <div className="mt-4 space-y-3 text-sm">
                <p className="text-navy-900"><strong>New Capital Fomento Mercantil Ltda.</strong></p>
                <p className="text-muted">Factoring Premium · Antecipação de Recebíveis</p>
                <p className="text-muted">contato@newcapital.com</p>
                <p className="text-muted">Seg. a Sex., 9h às 18h</p>
                <div className="border-t border-line pt-3 text-muted">
                  <p><strong className="text-navy-900">Matriz — Guaxupé/MG</strong><br />
                  Rua Salesianos, 265 · CEP 37830-056</p>
                  <p className="mt-2"><strong className="text-navy-900">Filial — São Paulo/SP</strong><br />
                  Rua Clodomiro Amazonas, 1099 · CEP 04537-012</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Já é cliente?</p>
              <p className="mt-2 text-sm text-muted">Acesse o portal para simular, enviar títulos e acompanhar operações.</p>
              <Button href="/login" variant="primary" size="sm" className="mt-4">Entrar no portal</Button>
            </Card>
          </div>

          <Card className="p-7">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">✓</span>
                <h3 className="font-serif text-xl font-semibold text-navy-900">Solicitação recebida!</h3>
                <p className="max-w-sm text-sm text-muted">Obrigado, {form.nome}. Nossa equipe analisará suas informações e entrará em contato em breve.</p>
                <Button variant="outline" size="sm" onClick={() => { setSent(false); setForm({ ...form, mensagem: "" }); }}>Enviar outra mensagem</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome" required><Input value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Seu nome" /></Field>
                <Field label="Empresa" required><Input value={form.empresa} onChange={(e) => set("empresa", e.target.value)} placeholder="Razão social" /></Field>
                <Field label="CNPJ"><Input value={form.cnpj} onChange={(e) => set("cnpj", maskCNPJ(e.target.value))} placeholder="00.000.000/0000-00" /></Field>
                <Field label="Telefone"><Input value={form.telefone} onChange={(e) => set("telefone", maskPhone(e.target.value))} placeholder="(00) 00000-0000" /></Field>
                <Field label="E-mail" required><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@empresa.com" /></Field>
                <Field label="Cidade"><Input value={form.cidade} onChange={(e) => set("cidade", e.target.value)} /></Field>
                <Field label="Estado">
                  <Input value={form.estado} onChange={(e) => set("estado", e.target.value.toUpperCase().slice(0, 2))} placeholder="UF" />
                </Field>
                <Field label="Volume mensal de recebíveis"><Input value={form.volume} onChange={(e) => set("volume", e.target.value)} placeholder="Ex.: R$ 300.000" /></Field>
                <Field label="Tipo de operação desejada">
                  <Select value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
                    <option value="convencional">Convencional</option>
                    <option value="sem-recurso">Sem Recurso</option>
                    <option value="com-recurso">Com Recurso</option>
                    <option value="trustee">Trustee</option>
                    <option value="maturity">Maturity</option>
                    <option value="cartao">Recebíveis de Cartão</option>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Mensagem"><Textarea rows={4} value={form.mensagem} onChange={(e) => set("mensagem", e.target.value)} placeholder="Conte um pouco sobre sua necessidade" /></Field>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" variant="gold" size="lg" className="w-full">Solicitar análise</Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        <div className="mt-8">
          <Disclaimer>
            Ao enviar, você concorda com o tratamento dos seus dados conforme nossa
            Política de Privacidade e a LGPD, para fins de contato e análise.
            A solicitação não constitui aprovação de crédito.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
