"use client";

import { PageHead } from "@/components/portal/Shell";
import { Card, StatCard, Disclaimer } from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  BRL,
  proposalStatusLabel,
  operationTypeLabel,
} from "@/lib/format";
import type { ProposalStatus, OperationType } from "@/lib/types";

const MES_LABEL = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function AdminRelatorios() {
  const { state } = useApp();

  // Volume por mês (valorBruto das propostas)
  const volumeMes: Record<string, number> = {};
  for (const p of state.proposals) {
    const d = new Date(p.data);
    if (isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    volumeMes[key] = (volumeMes[key] || 0) + p.valorBruto;
  }
  const volumeBars = Object.entries(volumeMes)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, value]) => {
      const [, m] = key.split("-");
      return { label: MES_LABEL[Number(m)] ?? key, value };
    });
  const maxVolume = Math.max(1, ...volumeBars.map((b) => b.value));

  // Propostas por status
  const statusCount: Record<string, number> = {};
  for (const p of state.proposals) {
    statusCount[p.status] = (statusCount[p.status] || 0) + 1;
  }
  const statusBars = Object.entries(statusCount).map(([k, v]) => ({
    label: proposalStatusLabel[k as ProposalStatus],
    value: v,
  }));
  const maxStatus = Math.max(1, ...statusBars.map((b) => b.value));

  // Operações por tipo (via proposta vinculada)
  const tipoCount: Record<string, number> = {};
  for (const o of state.operations) {
    const prop = state.proposals.find((p) => p.id === o.proposalId);
    const tipo = prop?.tipoOperacao ?? "convencional";
    tipoCount[tipo] = (tipoCount[tipo] || 0) + 1;
  }
  const tipoBars = Object.entries(tipoCount).map(([k, v]) => ({
    label: operationTypeLabel[k as OperationType],
    value: v,
  }));
  const maxTipo = Math.max(1, ...tipoBars.map((b) => b.value));

  // Top clientes por volume
  const clientVol: Record<string, number> = {};
  for (const p of state.proposals) {
    clientVol[p.clientId] = (clientVol[p.clientId] || 0) + p.valorBruto;
  }
  const topClientes = Object.entries(clientVol)
    .map(([id, v]) => ({
      label: state.clients.find((c) => c.id === id)?.razaoSocial ?? "—",
      value: v,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const maxClient = Math.max(1, ...topClientes.map((b) => b.value));

  const volumeTotal = state.proposals.reduce((a, p) => a + p.valorBruto, 0);
  const receita = state.proposals.reduce((a, p) => a + p.desagio + p.tarifa, 0);

  return (
    <>
      <PageHead
        title="Relatórios"
        subtitle="Indicadores demonstrativos da operação de fomento mercantil."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Volume total enviado" value={BRL(volumeTotal)} />
        <StatCard label="Receita estimada" value={BRL(receita)} tone="green" />
        <StatCard label="Propostas" value={state.proposals.length} />
        <StatCard label="Operações" value={state.operations.length} tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">Volume por mês</h2>
          <div className="space-y-3">
            {volumeBars.length === 0 && <p className="text-sm text-muted">Sem dados.</p>}
            {volumeBars.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{b.label}</span><span className="font-medium text-navy-900">{BRL(b.value)}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-navy-900/10">
                  <div className="h-full rounded-full bg-navy-900" style={{ width: `${(b.value / maxVolume) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">Propostas por status</h2>
          <div className="space-y-3">
            {statusBars.length === 0 && <p className="text-sm text-muted">Sem dados.</p>}
            {statusBars.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{b.label}</span><span className="font-medium text-navy-900">{b.value}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-navy-900/10">
                  <div className="h-full rounded-full bg-gold-400" style={{ width: `${(b.value / maxStatus) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">Operações por tipo</h2>
          <div className="space-y-3">
            {tipoBars.length === 0 && <p className="text-sm text-muted">Sem dados.</p>}
            {tipoBars.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{b.label}</span><span className="font-medium text-navy-900">{b.value}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-navy-900/10">
                  <div className="h-full rounded-full bg-navy-900" style={{ width: `${(b.value / maxTipo) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">Top clientes por volume</h2>
          <div className="space-y-3">
            {topClientes.length === 0 && <p className="text-sm text-muted">Sem dados.</p>}
            {topClientes.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span className="truncate pr-2">{b.label}</span><span className="font-medium text-navy-900">{BRL(b.value)}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-navy-900/10">
                  <div className="h-full rounded-full bg-gold-400" style={{ width: `${(b.value / maxClient) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Disclaimer>
          Relatórios demonstrativos gerados a partir de dados simulados. Não
          representam indicadores financeiros reais nem posições contábeis da
          New Capital Fomento Mercantil Ltda.
        </Disclaimer>
      </div>
    </>
  );
}
