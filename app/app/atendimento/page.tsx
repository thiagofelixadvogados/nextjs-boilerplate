"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Card,
  Button,
  Badge,
  Field,
  Input,
  Textarea,
  Select,
  Disclaimer,
  EmptyState,
} from "@/components/ui";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/format";

const CATEGORIAS = [
  "Cadastro",
  "Operação",
  "Documento",
  "Cobrança",
  "Proposta",
  "Financeiro",
  "Jurídico",
  "Compliance",
];

export default function AtendimentoPage() {
  const { state, currentClient, addTicket, toast } = useApp();
  const client = currentClient();
  const [assunto, setAssunto] = useState("");
  const [categoria, setCategoria] = useState("Cadastro");
  const [mensagem, setMensagem] = useState("");

  if (!client) return null;

  const tickets = state.tickets.filter((t) => t.clientId === client.id);

  const submit = () => {
    if (!assunto.trim()) {
      toast("Informe o assunto da mensagem.", "error");
      return;
    }
    if (!mensagem.trim()) {
      toast("Escreva sua mensagem antes de enviar.", "error");
      return;
    }
    addTicket({
      clientId: client.id,
      assunto: assunto.trim(),
      categoria,
      mensagem: mensagem.trim(),
    });
    toast("Mensagem enviada para nossa equipe.", "success");
    setAssunto("");
    setMensagem("");
    setCategoria("Cadastro");
  };

  return (
    <>
      <PageHead
        title="Atendimento"
        subtitle="Fale com a equipe da New Capital e acompanhe seu histórico."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        {/* Form */}
        <Card className="p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">
            Abrir nova solicitação
          </h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Assunto" required>
                <Input
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  placeholder="Resumo da sua solicitação"
                />
              </Field>
              <Field label="Categoria">
                <Select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Mensagem" required>
              <Textarea
                rows={5}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva sua dúvida ou solicitação em detalhes…"
              />
            </Field>
            <div className="flex justify-end">
              <Button variant="gold" onClick={submit}>
                Enviar mensagem
              </Button>
            </div>
          </div>
        </Card>

        {/* Contact card */}
        <Card className="h-fit overflow-hidden">
          <div className="bg-navy-gradient p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-white/55">
              Canais de contato
            </p>
            <p className="mt-2 font-serif text-lg font-semibold text-gold-300">
              Fale com a New Capital
            </p>
          </div>
          <div className="space-y-3 p-6 text-sm">
            <div>
              <p className="text-muted">E-mail</p>
              <p className="font-medium text-navy-900">contato@newcapital.com</p>
            </div>
            <div>
              <p className="text-muted">Horário de atendimento</p>
              <p className="font-medium text-navy-900">
                Seg. a Sex., 9h às 18h (horário de Brasília)
              </p>
            </div>
            <div>
              <p className="text-muted">Tempo médio de resposta</p>
              <p className="font-medium text-navy-900">até 1 dia útil</p>
            </div>
          </div>
        </Card>
      </div>

      {/* History */}
      <div className="mt-8">
        <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">
          Histórico de atendimento
        </h2>

        {tickets.length === 0 ? (
          <EmptyState
            title="Nenhuma mensagem ainda"
            description="Quando você enviar uma solicitação, ela aparecerá aqui com a resposta da nossa equipe."
          />
        ) : (
          <div className="space-y-6">
            {tickets.map((t) => (
              <div key={t.id} className="space-y-3">
                {/* Client bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-navy-900 px-4 py-3 text-white">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gold-300">
                        {t.assunto}
                      </span>
                      <Badge tone="gold">{t.categoria}</Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-white/90">
                      {t.mensagem}
                    </p>
                    <p className="mt-1.5 text-right text-[11px] text-white/50">
                      Você · {formatDate(t.data)}
                    </p>
                  </div>
                </div>

                {/* Auto-reply bubble */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 card-shadow">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-navy-900 text-[10px] font-bold text-gold-300">
                        FP
                      </span>
                      <span className="text-xs font-semibold text-navy-900">
                        Equipe New Capital
                      </span>
                      {t.respondido && <Badge tone="success">Respondido</Badge>}
                    </div>
                    <p className="text-sm leading-relaxed text-ink">
                      Recebemos sua mensagem. Nossa equipe responderá em breve.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Disclaimer>
          Este canal é demonstrativo. As respostas automáticas não constituem
          parecer técnico, jurídico ou de crédito. Não compartilhe senhas ou dados
          sensíveis desnecessários — tratamos dados pessoais conforme a LGPD.
        </Disclaimer>
      </div>
    </>
  );
}
