"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import { Card, Button, Badge, Modal, Table, Th, Td, EmptyState, Disclaimer } from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  BRL, pct, formatDate,
  proposalStatusLabel, proposalStatusTone, operationTypeLabel,
} from "@/lib/format";
import type { Proposal, ProposalStatus } from "@/lib/types";

const FILTERS: { value: ProposalStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "recebido", label: proposalStatusLabel.recebido },
  { value: "em-analise", label: proposalStatusLabel["em-analise"] },
  { value: "aprovado", label: proposalStatusLabel.aprovado },
  { value: "pendente-documento", label: proposalStatusLabel["pendente-documento"] },
  { value: "formalizacao", label: proposalStatusLabel.formalizacao },
  { value: "liberado", label: proposalStatusLabel.liberado },
  { value: "liquidado", label: proposalStatusLabel.liquidado },
  { value: "recusado", label: proposalStatusLabel.recusado },
];

export default function Propostas() {
  const { state, currentClient, acceptProposal, toast } = useApp();
  const client = currentClient();
  const [filter, setFilter] = useState<ProposalStatus | "todos">("todos");
  const [selected, setSelected] = useState<Proposal | null>(null);

  if (!client) return null;

  const all = state.proposals.filter((p) => p.clientId === client.id);
  const props = filter === "todos" ? all : all.filter((p) => p.status === filter);

  const aceitar = (p: Proposal) => {
    acceptProposal(p.id);
    toast(`Proposta ${p.numero} aceita. Operação em formalização.`, "success");
    setSelected(null);
  };

  return (
    <>
      <PageHead
        title="Minhas propostas"
        subtitle="Acompanhe a análise dos títulos enviados e aceite as propostas aprovadas."
        action={<Button href="/app/titulos" variant="gold">Enviar título</Button>}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((ff) => {
          const count = ff.value === "todos" ? all.length : all.filter((p) => p.status === ff.value).length;
          const active = filter === ff.value;
          return (
            <button
              key={ff.value}
              onClick={() => setFilter(ff.value)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-navy-900 text-white"
                  : "border border-line bg-white text-navy-900 hover:bg-navy-900/5"
              }`}
            >
              {ff.label}
              <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-navy-900/5 text-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {props.length === 0 ? (
        <EmptyState
          title={all.length === 0 ? "Nenhuma proposta enviada" : "Nenhuma proposta neste filtro"}
          description={all.length === 0 ? "Envie um título para iniciar a análise de antecipação." : "Selecione outro status para visualizar suas propostas."}
          action={all.length === 0 ? <Button href="/app/titulos" variant="gold">Enviar título</Button> : undefined}
        />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Número</Th>
              <Th>Data</Th>
              <Th>Valor bruto</Th>
              <Th>Valor líquido</Th>
              <Th>Prazo</Th>
              <Th>Tipo</Th>
              <Th>Sacado</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {props.map((p) => (
              <tr key={p.id} className="border-b border-line/60 last:border-0">
                <Td className="font-medium text-navy-900">{p.numero}</Td>
                <Td>{formatDate(p.data)}</Td>
                <Td>{BRL(p.valorBruto)}</Td>
                <Td className="font-medium text-navy-900">{BRL(p.valorLiquido)}</Td>
                <Td>{p.prazoDias} dias</Td>
                <Td>{operationTypeLabel[p.tipoOperacao]}</Td>
                <Td>{p.sacadoNome}</Td>
                <Td><Badge tone={proposalStatusTone[p.status]}>{proposalStatusLabel[p.status]}</Badge></Td>
                <Td>
                  <Button size="sm" variant="outline" onClick={() => setSelected(p)}>Ver detalhes</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Proposta ${selected.numero}` : ""}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Badge tone={proposalStatusTone[selected.status]}>{proposalStatusLabel[selected.status]}</Badge>
              <span className="text-xs text-muted">Enviada em {formatDate(selected.data)}</span>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-navy-900">Resumo da operação</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <Row k="Número do título" v={selected.numeroTitulo || "—"} />
                <Row k="Tipo de operação" v={operationTypeLabel[selected.tipoOperacao]} />
                <Row k="Sacado" v={selected.sacadoNome} />
                <Row k="CNPJ do sacado" v={selected.sacadoDoc || "—"} />
                <Row k="Vencimento" v={formatDate(selected.vencimento)} />
                <Row k="Prazo" v={`${selected.prazoDias} dias`} />
              </div>
            </div>

            <div className="rounded-xl border border-line bg-paper/50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-navy-900">Taxas e valores</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <Row k="Valor bruto" v={BRL(selected.valorBruto)} />
                <Row k="Taxa mensal" v={`${pct(selected.taxaMensal)} a.m.`} />
                <Row k="Deságio" v={BRL(selected.desagio)} />
                <Row k="Tarifa" v={BRL(selected.tarifa)} />
                <Row k="Valor líquido" v={BRL(selected.valorLiquido)} strong />
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-navy-900">Linha do tempo</h4>
              <ol className="relative space-y-4 border-l border-line pl-5">
                {selected.timeline.map((ev, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full bg-gold-500 ring-4 ring-white" />
                    <p className="text-sm font-medium text-navy-900">{ev.label}</p>
                    <p className="text-xs text-muted">{ev.detail}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{formatDate(ev.date)}</p>
                  </li>
                ))}
              </ol>
            </div>

            {selected.status === "aprovado" && (
              <Button variant="gold" size="lg" className="w-full" onClick={() => aceitar(selected)}>
                Aceitar proposta
              </Button>
            )}
            {selected.status === "pendente-documento" && (
              <Button href="/app/documentos" variant="primary" size="lg" className="w-full">
                Enviar documentos pendentes
              </Button>
            )}

            <Disclaimer>
              Valores demonstrativos. O aceite formaliza a cessão do crédito e está
              sujeito às condições contratuais e à política interna da Fluxo Prime.
            </Disclaimer>
          </div>
        )}
      </Modal>
    </>
  );
}

function Row({ k, v, strong }: { k: string; v: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted">{k}</span>
      <span className={strong ? "font-semibold text-gold-600" : "font-medium text-navy-900"}>{v}</span>
    </div>
  );
}
