"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import { Button, StatCard, Badge, Modal, Table, Th, Td, EmptyState, Disclaimer } from "@/components/ui";
import { useApp } from "@/lib/store";
import { BRL, formatDate, operationStatusLabel, operationStatusTone } from "@/lib/format";
import type { Operation } from "@/lib/types";

export default function Operacoes() {
  const { state, currentClient } = useApp();
  const client = currentClient();
  const [selected, setSelected] = useState<Operation | null>(null);

  if (!client) return null;

  const ops = state.operations.filter((o) => o.clientId === client.id);

  const totalLiberado = ops.reduce((a, o) => a + o.valorLiberado, 0);
  const emAberto = ops.filter((o) => o.status === "em-aberto" || o.status === "atrasado").reduce((a, o) => a + o.valorPendente, 0);
  const liquidado = ops.filter((o) => o.status === "liquidado").reduce((a, o) => a + o.valorRecebido, 0);
  const emAtraso = ops.filter((o) => o.status === "atrasado").reduce((a, o) => a + o.valorPendente, 0);

  return (
    <>
      <PageHead
        title="Operações"
        subtitle="Acompanhe os recebíveis liberados, recebimentos e liquidações."
        action={<Button href="/app/titulos" variant="gold">Enviar título</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total liberado" value={BRL(totalLiberado)} tone="gold" />
        <StatCard label="Em aberto" value={BRL(emAberto)} />
        <StatCard label="Liquidado" value={BRL(liquidado)} tone="green" />
        <StatCard label="Em atraso" value={BRL(emAtraso)} tone="red" />
      </div>

      {ops.length === 0 ? (
        <EmptyState
          title="Nenhuma operação ativa"
          description="As operações aparecem aqui após o aceite de uma proposta aprovada."
          action={<Button href="/app/propostas" variant="gold">Ver propostas</Button>}
        />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Código</Th>
              <Th>Valor liberado</Th>
              <Th>Liberação</Th>
              <Th>Vencimento</Th>
              <Th>Sacado</Th>
              <Th>Recebido</Th>
              <Th>Pendente</Th>
              <Th>Atraso</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {ops.map((o) => (
              <tr key={o.id} className="border-b border-line/60 last:border-0">
                <Td className="font-medium text-navy-900">{o.codigo}</Td>
                <Td className="font-medium text-navy-900">{BRL(o.valorLiberado)}</Td>
                <Td>{formatDate(o.dataLiberacao)}</Td>
                <Td>{formatDate(o.vencimento)}</Td>
                <Td>{o.sacadoNome}</Td>
                <Td>{BRL(o.valorRecebido)}</Td>
                <Td>{BRL(o.valorPendente)}</Td>
                <Td className={o.diasAtraso > 0 ? "font-semibold text-red-600" : ""}>
                  {o.diasAtraso > 0 ? `${o.diasAtraso} dias` : "—"}
                </Td>
                <Td><Badge tone={operationStatusTone[o.status]}>{operationStatusLabel[o.status]}</Badge></Td>
                <Td>
                  <Button size="sm" variant="outline" onClick={() => setSelected(o)}>Ver operação</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="mt-6">
        <Disclaimer>
          Os valores recebidos e em atraso são atualizados conforme a liquidação dos
          títulos pelo sacado. Operações em atraso podem estar sujeitas a encargos e,
          nas modalidades com recurso, a regresso conforme contrato.
        </Disclaimer>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Operação ${selected.codigo}` : ""}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Badge tone={operationStatusTone[selected.status]}>{operationStatusLabel[selected.status]}</Badge>
              {selected.diasAtraso > 0 && (
                <span className="text-xs font-semibold text-red-600">{selected.diasAtraso} dias em atraso</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Row k="Sacado" v={selected.sacadoNome} />
              <Row k="Data de liberação" v={formatDate(selected.dataLiberacao)} />
              <Row k="Vencimento" v={formatDate(selected.vencimento)} />
              <Row k="Valor liberado" v={BRL(selected.valorLiberado)} />
              <Row k="Valor recebido" v={BRL(selected.valorRecebido)} />
              <Row k="Valor pendente" v={BRL(selected.valorPendente)} strong />
            </div>

            <div className="rounded-xl border border-line bg-paper/50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Progresso de recebimento</span>
                <span className="font-medium text-navy-900">
                  {selected.valorLiberado + selected.valorPendente > 0
                    ? Math.round((selected.valorRecebido / (selected.valorRecebido + selected.valorPendente || 1)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-900/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
                  style={{
                    width: `${Math.min(100, Math.round((selected.valorRecebido / (selected.valorRecebido + selected.valorPendente || 1)) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <Disclaimer>
              Informações demonstrativas referentes à operação de fomento mercantil
              registrada no portal New Capital.
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
