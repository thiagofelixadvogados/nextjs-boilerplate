"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import { Card, Select, Field, Disclaimer, EmptyState } from "@/components/ui";
import { useApp } from "@/lib/store";

const CHECKLIST = [
  { key: "kyc", label: "KYC — Conheça seu cliente", default: true },
  { key: "kyb", label: "KYB — Conheça sua empresa", default: true },
  { key: "cnpj", label: "Consulta CNPJ / situação cadastral", default: true },
  { key: "societarios", label: "Documentos societários", default: true },
  { key: "socios", label: "Documentos dos sócios", default: false },
  { key: "pep", label: "Verificação PEP", default: false },
  { key: "sancoes", label: "Listas de sanções", default: true },
  { key: "midia", label: "Mídia negativa", default: false },
  { key: "coaf", label: "Comunicação COAF", default: false },
  { key: "pldft", label: "Política PLD/FT", default: true },
  { key: "lgpd", label: "Conformidade LGPD", default: true },
  { key: "sacado", label: "Validação de sacado", default: false },
  { key: "fraude", label: "Prevenção a fraude", default: true },
  { key: "entrega", label: "Comprovante de entrega", default: false },
  { key: "titulo", label: "Confirmação do título", default: false },
] as const;

export default function AdminCompliance() {
  const { state } = useApp();
  const [clientId, setClientId] = useState(state.clients[0]?.id ?? "");
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CHECKLIST.map((c) => [c.key, c.default]))
  );

  const toggle = (key: string) =>
    setChecked((c) => ({ ...c, [key]: !c[key] }));

  const done = CHECKLIST.filter((c) => checked[c.key]).length;
  const total = CHECKLIST.length;
  const pctDone = Math.round((done / total) * 100);

  if (state.clients.length === 0) {
    return (
      <>
        <PageHead title="Compliance & PLD/FT" />
        <EmptyState title="Sem clientes" description="Cadastre um cliente para iniciar o checklist." />
      </>
    );
  }

  return (
    <>
      <PageHead
        title="Compliance & PLD/FT"
        subtitle="Checklist de onboarding, prevenção à lavagem e diligência por cliente."
        action={
          <div className="w-64">
            <Field label="Cliente">
              <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
                {state.clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.razaoSocial}</option>
                ))}
              </Select>
            </Field>
          </div>
        }
      />

      <Card className="mb-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Progresso da diligência</h2>
          <span className="text-sm font-semibold text-navy-900">{done}/{total} concluído</span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-navy-900/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all"
            style={{ width: `${pctDone}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">{pctDone}% dos itens de compliance concluídos.</p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {CHECKLIST.map((item) => {
          const on = checked[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                on
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-line bg-white hover:bg-navy-900/5"
              }`}
            >
              <span
                className={`grid h-7 w-7 flex-none place-items-center rounded-full text-sm font-bold ${
                  on ? "bg-emerald-500 text-white" : "bg-navy-900/10 text-muted"
                }`}
              >
                {on ? "✓" : "○"}
              </span>
              <span className={`text-sm font-medium ${on ? "text-emerald-900" : "text-navy-900"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <Disclaimer>
          O preenchimento deste checklist é demonstrativo. A operação de fomento
          mercantil está sujeita às obrigações de Prevenção à Lavagem de Dinheiro
          e ao Financiamento do Terrorismo (PLD/FT), à comunicação de operações
          suspeitas ao COAF e ao tratamento de dados pessoais conforme a Lei Geral
          de Proteção de Dados (LGPD). Nenhum dado real é processado neste ambiente.
        </Disclaimer>
      </div>
    </>
  );
}
