"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Badge,
  Button,
  Field,
  Input,
  Textarea,
  Select,
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
  proposalStatusLabel,
  proposalStatusTone,
} from "@/lib/format";
import type { Proposal, ProposalStatus } from "@/lib/types";

const STATUSES: ProposalStatus[] = [
  "recebido",
  "em-analise",
  "pendente-documento",
  "aprovado",
  "formalizacao",
  "liberado",
  "liquidado",
  "recusado",
];

export default function AdminPropostas() {
  const { state, updateProposalStatus, toast } = useApp();
  const [edit, setEdit] = useState<Proposal | null>(null);

  // editable form state
  const [valorBruto, setValorBruto] = useState(0);
  const [desagio, setDesagio] = useState(0);
  const [taxa, setTaxa] = useState(0);
  const [tarifa, setTarifa] = useState(0);
  const [prazo, setPrazo] = useState(0);
  const [obs, setObs] = useState("");
  const [status, setStatus] = useState<ProposalStatus>("recebido");

  const clientName = (id: string) =>
    state.clients.find((c) => c.id === id)?.razaoSocial ?? "—";

  const valorLiquido = Math.max(0, valorBruto - desagio - tarifa);

  const openEdit = (p: Proposal) => {
    setEdit(p);
    setValorBruto(p.valorBruto);
    setDesagio(p.desagio);
    setTaxa(p.taxaMensal);
    setTarifa(p.tarifa);
    setPrazo(p.prazoDias);
    setStatus(p.status);
    setObs("");
  };

  const save = () => {
    if (!edit) return;
    const note =
      obs.trim() ||
      `Proposta revisada: valor líquido ${BRL(valorLiquido)}, taxa ${pct(taxa)}.`;
    updateProposalStatus(edit.id, status, note);
    toast("Proposta atualizada.");
    setEdit(null);
  };

  return (
    <>
      <PageHead
        title="Propostas"
        subtitle="Todas as propostas geradas para os clientes do portal."
      />

      {state.proposals.length === 0 ? (
        <EmptyState title="Nenhuma proposta" description="Ainda não há propostas cadastradas." />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Proposta</Th>
              <Th>Cliente</Th>
              <Th>Valor bruto</Th>
              <Th>Deságio</Th>
              <Th>Taxa</Th>
              <Th>Valor líquido</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {state.proposals.map((p) => (
              <tr key={p.id} className="border-b border-line/60 last:border-0">
                <Td className="font-medium text-navy-900">{p.numero}</Td>
                <Td>{clientName(p.clientId)}</Td>
                <Td>{BRL(p.valorBruto)}</Td>
                <Td>{BRL(p.desagio)}</Td>
                <Td>{pct(p.taxaMensal)}</Td>
                <Td>{BRL(p.valorLiquido)}</Td>
                <Td><Badge tone={proposalStatusTone[p.status]}>{proposalStatusLabel[p.status]}</Badge></Td>
                <Td>
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                    Gerar/editar
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit ? `Proposta ${edit.numero}` : undefined}
        maxWidth="max-w-xl"
      >
        {edit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Valor bruto (R$)">
                <Input type="number" value={valorBruto} onChange={(e) => setValorBruto(Number(e.target.value))} />
              </Field>
              <Field label="Deságio (R$)">
                <Input type="number" value={desagio} onChange={(e) => setDesagio(Number(e.target.value))} />
              </Field>
              <Field label="Taxa mensal (% a.m.)">
                <Input type="number" step="0.1" value={taxa} onChange={(e) => setTaxa(Number(e.target.value))} />
              </Field>
              <Field label="Tarifa (R$)">
                <Input type="number" value={tarifa} onChange={(e) => setTarifa(Number(e.target.value))} />
              </Field>
              <Field label="Prazo (dias)">
                <Input type="number" value={prazo} onChange={(e) => setPrazo(Number(e.target.value))} />
              </Field>
              <Field label="Status">
                <Select value={status} onChange={(e) => setStatus(e.target.value as ProposalStatus)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{proposalStatusLabel[s]}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="rounded-xl bg-navy-900/5 px-4 py-3 text-sm">
              <span className="text-muted">Valor líquido calculado: </span>
              <span className="font-semibold text-navy-900">{BRL(valorLiquido)}</span>
            </div>

            <Field label="Observação / nota da timeline">
              <Textarea rows={3} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Registro adicionado ao histórico da proposta." />
            </Field>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEdit(null)}>Cancelar</Button>
              <Button variant="gold" onClick={save}>Salvar proposta</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
