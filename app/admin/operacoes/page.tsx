"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Badge,
  StatCard,
  Select,
  Table,
  Th,
  Td,
  EmptyState,
} from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  BRL,
  formatDate,
  operationStatusLabel,
  operationStatusTone,
} from "@/lib/format";
import type { OperationStatus } from "@/lib/types";

const STATUSES: OperationStatus[] = ["liberado", "em-aberto", "liquidado", "atrasado"];

export default function AdminOperacoes() {
  const { state } = useApp();
  const [filter, setFilter] = useState<OperationStatus | "todos">("todos");

  const clientName = (id: string) =>
    state.clients.find((c) => c.id === id)?.razaoSocial ?? "—";

  const ops = state.operations.filter(
    (o) => filter === "todos" || o.status === filter
  );

  const totalLiberado = state.operations.reduce((a, o) => a + o.valorLiberado, 0);
  const totalPendente = state.operations.reduce((a, o) => a + o.valorPendente, 0);
  const totalRecebido = state.operations.reduce((a, o) => a + o.valorRecebido, 0);
  const atrasadas = state.operations.filter((o) => o.diasAtraso > 0).length;

  return (
    <>
      <PageHead
        title="Operações"
        subtitle="Acompanhamento de todas as operações liberadas e em aberto."
        action={
          <div className="w-48">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as OperationStatus | "todos")}
            >
              <option value="todos">Todos os status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{operationStatusLabel[s]}</option>
              ))}
            </Select>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total liberado" value={BRL(totalLiberado)} tone="gold" />
        <StatCard label="Total recebido" value={BRL(totalRecebido)} tone="green" />
        <StatCard label="Total pendente" value={BRL(totalPendente)} />
        <StatCard label="Operações em atraso" value={atrasadas} tone="red" />
      </div>

      {ops.length === 0 ? (
        <EmptyState title="Nenhuma operação" description="Não há operações com este status." />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Código</Th>
              <Th>Cliente</Th>
              <Th>Sacado</Th>
              <Th>Liberado</Th>
              <Th>Liberação</Th>
              <Th>Vencimento</Th>
              <Th>Recebido</Th>
              <Th>Pendente</Th>
              <Th>Atraso</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {ops.map((o) => (
              <tr key={o.id} className="border-b border-line/60 last:border-0">
                <Td className="font-medium text-navy-900">{o.codigo}</Td>
                <Td>{clientName(o.clientId)}</Td>
                <Td>{o.sacadoNome}</Td>
                <Td>{BRL(o.valorLiberado)}</Td>
                <Td>{formatDate(o.dataLiberacao)}</Td>
                <Td>{formatDate(o.vencimento)}</Td>
                <Td>{BRL(o.valorRecebido)}</Td>
                <Td>{BRL(o.valorPendente)}</Td>
                <Td className={o.diasAtraso > 0 ? "font-semibold text-red-600" : ""}>
                  {o.diasAtraso > 0 ? `${o.diasAtraso}d` : "—"}
                </Td>
                <Td><Badge tone={operationStatusTone[o.status]}>{operationStatusLabel[o.status]}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
