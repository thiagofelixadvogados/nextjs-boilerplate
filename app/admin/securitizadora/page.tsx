"use client";

import { useMemo, useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Card,
  Badge,
  Button,
  Field,
  Input,
  Select,
  Disclaimer,
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
  riskLabel,
  carteiraStatusLabel,
  carteiraStatusTone,
} from "@/lib/format";
import { uid } from "@/lib/format";
import type { Carteira, CarteiraStatus, RiskLevel } from "@/lib/types";

const ELEGIVEIS: string[] = ["liberado", "em-aberto", "liquidado"];

const CARTEIRA_STATUSES: CarteiraStatus[] = [
  "em-formacao",
  "elegivel",
  "enviada",
  "aprovada",
  "recusada",
  "liquidada",
];

export default function AdminSecuritizadora() {
  const { state, saveCarteira, toast } = useApp();

  const elegiveis = useMemo(
    () => state.operations.filter((o) => ELEGIVEIS.includes(o.status)),
    [state.operations]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [nome, setNome] = useState("Carteira NC-2026");
  const [status, setStatus] = useState<CarteiraStatus>("em-formacao");

  const toggle = (id: string) =>
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );

  const selectedOps = elegiveis.filter((o) => selectedIds.includes(o.id));

  const valorTotal = selectedOps.reduce((a, o) => a + o.valorLiberado, 0);

  const prazoMedio = selectedOps.length
    ? Math.round(
        selectedOps.reduce((a, o) => {
          const dias =
            (+new Date(o.vencimento) - +new Date(o.dataLiberacao)) /
            (1000 * 60 * 60 * 24);
          return a + Math.max(0, dias);
        }, 0) / selectedOps.length
      )
    : 0;

  const taxaMedia = selectedOps.length
    ? selectedOps.reduce((a, o) => {
        const prop = state.proposals.find((p) => p.id === o.proposalId);
        return a + (prop?.taxaMensal ?? 2.5);
      }, 0) / selectedOps.length
    : 0;

  const atrasos = selectedOps.filter((o) => o.diasAtraso > 0).length;
  const riscoMedio: RiskLevel = atrasos > 0 ? "medio" : "baixo";

  const clientName = (id: string) =>
    state.clients.find((c) => c.id === id)?.razaoSocial ?? "—";

  const salvar = () => {
    if (selectedIds.length === 0) {
      toast("Selecione ao menos uma operação.", "error");
      return;
    }
    const carteira: Carteira = {
      id: uid("cart"),
      nome: nome.trim() || "Carteira sem nome",
      operationIds: selectedIds,
      valorTotal,
      prazoMedio,
      taxaMedia: Number(taxaMedia.toFixed(2)),
      riscoMedio,
      status,
    };
    saveCarteira(carteira);
    toast("Carteira salva.");
    setSelectedIds([]);
  };

  return (
    <>
      <PageHead
        title="Securitizadora"
        subtitle="Montagem de carteiras de recebíveis para cessão à securitizadora."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Operations selection */}
        <div>
          <h2 className="mb-3 font-serif text-lg font-semibold text-navy-900">Operações elegíveis</h2>
          {elegiveis.length === 0 ? (
            <EmptyState title="Sem operações elegíveis" description="Não há operações disponíveis para securitização." />
          ) : (
            <Table>
              <thead>
                <tr className="border-b border-line">
                  <Th />
                  <Th>Código</Th>
                  <Th>Cliente</Th>
                  <Th>Liberado</Th>
                  <Th>Vencimento</Th>
                </tr>
              </thead>
              <tbody>
                {elegiveis.map((o) => (
                  <tr
                    key={o.id}
                    className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-navy-900/5"
                    onClick={() => toggle(o.id)}
                  >
                    <Td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(o.id)}
                        onChange={() => toggle(o.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 accent-gold-500"
                      />
                    </Td>
                    <Td className="font-medium text-navy-900">{o.codigo}</Td>
                    <Td>{clientName(o.clientId)}</Td>
                    <Td>{BRL(o.valorLiberado)}</Td>
                    <Td>{formatDate(o.vencimento)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {/* Summary / builder */}
        <Card className="h-fit p-5">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Resumo da carteira</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Operações</dt><dd className="font-medium text-navy-900">{selectedOps.length}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Valor total</dt><dd className="font-semibold text-navy-900">{BRL(valorTotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Prazo médio</dt><dd className="font-medium text-navy-900">{prazoMedio} dias</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Taxa média</dt><dd className="font-medium text-navy-900">{pct(taxaMedia)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Risco médio</dt><dd className="font-medium text-navy-900">{riskLabel[riscoMedio]}</dd></div>
          </dl>

          <div className="mt-4 space-y-3">
            <Field label="Nome da carteira">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            </Field>
            <Field label="Status da carteira">
              <Select value={status} onChange={(e) => setStatus(e.target.value as CarteiraStatus)}>
                {CARTEIRA_STATUSES.map((s) => (
                  <option key={s} value={s}>{carteiraStatusLabel[s]}</option>
                ))}
              </Select>
            </Field>
            <Button variant="gold" className="w-full" onClick={salvar}>Salvar carteira</Button>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-serif text-lg font-semibold text-navy-900">Carteiras existentes</h2>
        {state.carteiras.length === 0 ? (
          <EmptyState title="Nenhuma carteira" description="Monte a primeira carteira selecionando operações." />
        ) : (
          <Table>
            <thead>
              <tr className="border-b border-line">
                <Th>Carteira</Th>
                <Th>Operações</Th>
                <Th>Valor total</Th>
                <Th>Prazo médio</Th>
                <Th>Taxa média</Th>
                <Th>Risco</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {state.carteiras.map((c) => (
                <tr key={c.id} className="border-b border-line/60 last:border-0">
                  <Td className="font-medium text-navy-900">{c.nome}</Td>
                  <Td>{c.operationIds.length}</Td>
                  <Td>{BRL(c.valorTotal)}</Td>
                  <Td>{c.prazoMedio} dias</Td>
                  <Td>{pct(c.taxaMedia)}</Td>
                  <Td>{riskLabel[c.riscoMedio]}</Td>
                  <Td><Badge tone={carteiraStatusTone[c.status]}>{carteiraStatusLabel[c.status]}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <div className="mt-6">
        <Disclaimer>
          A cessão de carteiras à securitizadora é demonstrativa e está sujeita à
          aprovação da contraparte, à elegibilidade dos recebíveis, à diligência de
          crédito e às condições de mercado vigentes. Os parâmetros exibidos não
          constituem oferta firme nem garantia de aquisição.
        </Disclaimer>
      </div>
    </>
  );
}
