"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHead } from "@/components/portal/Shell";
import { Card, Field, Input, Select, Button, Disclaimer, Badge } from "@/components/ui";
import { useApp } from "@/lib/store";
import { BRL, pct, simulateFactoring, maskCNPJ } from "@/lib/format";
import type { OperationType, ReceivableType } from "@/lib/types";

export default function Simular() {
  const { addProposal, toast, currentClient } = useApp();
  const router = useRouter();
  const client = currentClient();

  const [f, setF] = useState({
    tipoOperacao: "convencional" as OperationType,
    tipoRecebivel: "duplicata" as ReceivableType,
    valor: "50000",
    prazo: "45",
    taxa: "2.5",
    sacadoNome: "",
    sacadoDoc: "",
    vencimento: "",
    comRecurso: "true",
    possuiComprovante: "true",
    possuiNF: "true",
    historico: "novo",
  });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  const sim = useMemo(() => {
    const valorBruto = Number(f.valor) || 0;
    const prazoDias = Number(f.prazo) || 1;
    let taxa = Number(f.taxa) || 2.5;
    if (f.historico === "recorrente") taxa = Math.max(0.5, taxa - 0.3);
    if (f.historico === "primeiro") taxa += 0.4;
    return {
      valorBruto, prazoDias,
      ...simulateFactoring({
        valorBruto, prazoDias, taxaMensal: taxa,
        comRecurso: f.comRecurso === "true",
        possuiNF: f.possuiNF === "true",
        possuiComprovante: f.possuiComprovante === "true",
      }),
    };
  }, [f]);

  const enviar = () => {
    if (!client) return;
    if (!f.sacadoNome) { toast("Informe o sacado para enviar a análise.", "error"); return; }
    const venc = f.vencimento || new Date(Date.now() + sim.prazoDias * 864e5).toISOString().slice(0, 10);
    const p = addProposal({
      clientId: client.id,
      tipoOperacao: f.tipoOperacao,
      tipoRecebivel: f.tipoRecebivel,
      comRecurso: f.comRecurso === "true",
      numeroTitulo: "",
      sacadoNome: f.sacadoNome,
      sacadoDoc: f.sacadoDoc,
      sacadoEmail: "",
      sacadoTelefone: "",
      valorBruto: sim.valorBruto,
      prazoDias: sim.prazoDias,
      vencimento: venc,
      taxaMensal: sim.taxaEfetiva,
      desagio: Math.round(sim.desagio),
      tarifa: Math.round(sim.tarifa),
      valorLiquido: Math.round(sim.valorLiquido),
      descricao: "Enviado a partir do simulador.",
      possuiNF: f.possuiNF === "true",
      possuiComprovante: f.possuiComprovante === "true",
    });
    toast(`Proposta ${p.numero} enviada para análise.`, "success");
    router.push("/app/propostas");
  };

  return (
    <>
      <PageHead title="Simular operação" subtitle="Estimativa demonstrativa de antecipação de recebíveis." />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de operação">
              <Select value={f.tipoOperacao} onChange={(e) => set("tipoOperacao", e.target.value)}>
                <option value="convencional">Convencional</option>
                <option value="sem-recurso">Sem Recurso</option>
                <option value="com-recurso">Com Recurso</option>
                <option value="trustee">Trustee</option>
                <option value="maturity">Maturity</option>
                <option value="cartao">Recebíveis de Cartão</option>
              </Select>
            </Field>
            <Field label="Tipo de recebível">
              <Select value={f.tipoRecebivel} onChange={(e) => set("tipoRecebivel", e.target.value)}>
                <option value="duplicata">Duplicata</option>
                <option value="nota-fiscal">Nota Fiscal</option>
                <option value="cheque">Cheque</option>
                <option value="promissoria">Promissória</option>
                <option value="cartao">Cartão</option>
                <option value="contrato">Contrato</option>
              </Select>
            </Field>
            <Field label="Valor do título (R$)"><Input type="number" value={f.valor} onChange={(e) => set("valor", e.target.value)} /></Field>
            <Field label="Prazo (dias)"><Input type="number" value={f.prazo} onChange={(e) => set("prazo", e.target.value)} /></Field>
            <Field label="Taxa base (% a.m.)"><Input type="number" step="0.1" value={f.taxa} onChange={(e) => set("taxa", e.target.value)} /></Field>
            <Field label="Data de vencimento"><Input type="date" value={f.vencimento} onChange={(e) => set("vencimento", e.target.value)} /></Field>
            <Field label="Nome do sacado"><Input value={f.sacadoNome} onChange={(e) => set("sacadoNome", e.target.value)} placeholder="Quem deve pagar o título" /></Field>
            <Field label="CNPJ do sacado"><Input value={f.sacadoDoc} onChange={(e) => set("sacadoDoc", maskCNPJ(e.target.value))} /></Field>
            <Field label="Modalidade de risco">
              <Select value={f.comRecurso} onChange={(e) => set("comRecurso", e.target.value)}>
                <option value="true">Com recurso (regresso)</option>
                <option value="false">Sem recurso (risco assumido)</option>
              </Select>
            </Field>
            <Field label="Histórico com o sacado">
              <Select value={f.historico} onChange={(e) => set("historico", e.target.value)}>
                <option value="recorrente">Recorrente</option>
                <option value="novo">Eventual</option>
                <option value="primeiro">Primeiro título</option>
              </Select>
            </Field>
            <Field label="Possui nota fiscal?">
              <Select value={f.possuiNF} onChange={(e) => set("possuiNF", e.target.value)}>
                <option value="true">Sim</option><option value="false">Não</option>
              </Select>
            </Field>
            <Field label="Possui comprovante de entrega?">
              <Select value={f.possuiComprovante} onChange={(e) => set("possuiComprovante", e.target.value)}>
                <option value="true">Sim</option><option value="false">Não</option>
              </Select>
            </Field>
          </div>
        </Card>

        {/* Result */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="bg-navy-gradient p-6 text-white">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-white/55">Valor líquido estimado</p>
                <Badge tone="warning">Sujeito à análise</Badge>
              </div>
              <p className="mt-1 font-serif text-4xl font-semibold text-gold-300">{BRL(sim.valorLiquido)}</p>
            </div>
            <div className="space-y-2.5 p-6 text-sm">
              {[
                ["Valor bruto", BRL(sim.valorBruto)],
                ["Prazo", `${sim.prazoDias} dias`],
                ["Taxa efetiva (demonstrativa)", pct(sim.taxaEfetiva) + " a.m."],
                ["Deságio estimado", BRL(sim.desagio)],
                ["Tarifa operacional", BRL(sim.tarifa)],
                ["Custo total", BRL(sim.custoTotal)],
                ["CET demonstrativo", pct(sim.cetMensal) + " a.m."],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-line/60 pb-2 last:border-0">
                  <span className="text-muted">{k}</span>
                  <span className="font-medium text-navy-900">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Button variant="gold" size="lg" className="w-full" onClick={enviar}>
            Enviar título para análise
          </Button>
          <Disclaimer>
            Simulação meramente indicativa. A aprovação e as condições finais
            dependem de análise cadastral, documental, crédito do sacado, prevenção
            à fraude e política interna da Fluxo Prime.
          </Disclaimer>
        </div>
      </div>
    </>
  );
}
