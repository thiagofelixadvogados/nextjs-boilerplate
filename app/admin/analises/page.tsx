"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Badge,
  Button,
  Modal,
  Table,
  Th,
  Td,
  EmptyState,
} from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  BRL,
  pct,
  formatDate,
  proposalStatusLabel,
  proposalStatusTone,
  operationTypeLabel,
  receivableTypeLabel,
} from "@/lib/format";
import type { Proposal } from "@/lib/types";

const FILA: Proposal["status"][] = ["recebido", "em-analise", "pendente-documento"];

export default function AdminAnalises() {
  const { state, updateProposalStatus, toast } = useApp();
  const [selected, setSelected] = useState<Proposal | null>(null);

  const fila = state.proposals.filter((p) => FILA.includes(p.status));

  const clientName = (id: string) =>
    state.clients.find((c) => c.id === id)?.razaoSocial ?? "—";

  const aprovar = (id: string) => {
    updateProposalStatus(id, "aprovado", "Crédito do sacado aprovado.");
    toast("Título aprovado.");
    setSelected(null);
  };
  const recusar = (id: string) => {
    updateProposalStatus(id, "recusado", "Operação recusada após análise.");
    toast("Título recusado.", "error");
    setSelected(null);
  };
  const pendencia = (id: string) => {
    updateProposalStatus(id, "pendente-documento", "Documentação pendente.");
    toast("Pendência registrada.", "info");
    setSelected(null);
  };

  return (
    <>
      <PageHead
        title="Análise de títulos"
        subtitle="Fila de títulos aguardando decisão de crédito e documental."
      />

      {fila.length === 0 ? (
        <EmptyState title="Fila vazia" description="Nenhum título aguardando análise no momento." />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Título</Th>
              <Th>Cliente</Th>
              <Th>Sacado</Th>
              <Th>Tipo</Th>
              <Th>Valor bruto</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {fila.map((p) => (
              <tr key={p.id} className="border-b border-line/60 last:border-0">
                <Td className="font-medium text-navy-900">{p.numero}</Td>
                <Td>{clientName(p.clientId)}</Td>
                <Td>{p.sacadoNome}</Td>
                <Td>{operationTypeLabel[p.tipoOperacao]}</Td>
                <Td>{BRL(p.valorBruto)}</Td>
                <Td><Badge tone={proposalStatusTone[p.status]}>{proposalStatusLabel[p.status]}</Badge></Td>
                <Td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="gold" onClick={() => aprovar(p.id)}>Aprovar</Button>
                    <Button size="sm" variant="danger" onClick={() => recusar(p.id)}>Recusar</Button>
                    <Button size="sm" variant="outline" onClick={() => pendencia(p.id)}>Pendência</Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelected(p)}>Ver</Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Título ${selected.numero}` : undefined}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div><dt className="text-muted">Cliente</dt><dd className="font-medium text-navy-900">{clientName(selected.clientId)}</dd></div>
              <div><dt className="text-muted">Sacado</dt><dd className="font-medium text-navy-900">{selected.sacadoNome}</dd></div>
              <div><dt className="text-muted">Número do título</dt><dd className="font-medium text-navy-900">{selected.numeroTitulo}</dd></div>
              <div><dt className="text-muted">Tipo de operação</dt><dd className="font-medium text-navy-900">{operationTypeLabel[selected.tipoOperacao]}</dd></div>
              <div><dt className="text-muted">Recebível</dt><dd className="font-medium text-navy-900">{receivableTypeLabel[selected.tipoRecebivel]}</dd></div>
              <div><dt className="text-muted">Valor bruto</dt><dd className="font-medium text-navy-900">{BRL(selected.valorBruto)}</dd></div>
              <div><dt className="text-muted">Deságio</dt><dd className="font-medium text-navy-900">{BRL(selected.desagio)}</dd></div>
              <div><dt className="text-muted">Taxa mensal</dt><dd className="font-medium text-navy-900">{pct(selected.taxaMensal)}</dd></div>
              <div><dt className="text-muted">Valor líquido</dt><dd className="font-medium text-navy-900">{BRL(selected.valorLiquido)}</dd></div>
              <div><dt className="text-muted">Vencimento</dt><dd className="font-medium text-navy-900">{formatDate(selected.vencimento)}</dd></div>
              <div><dt className="text-muted">Possui NF</dt><dd className="font-medium text-navy-900">{selected.possuiNF ? "Sim" : "Não"}</dd></div>
              <div><dt className="text-muted">Comprovante</dt><dd className="font-medium text-navy-900">{selected.possuiComprovante ? "Sim" : "Não"}</dd></div>
            </dl>
            <p className="text-sm text-muted">{selected.descricao}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="gold" onClick={() => aprovar(selected.id)}>Aprovar</Button>
              <Button variant="danger" onClick={() => recusar(selected.id)}>Recusar</Button>
              <Button variant="outline" onClick={() => pendencia(selected.id)}>Registrar pendência</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
