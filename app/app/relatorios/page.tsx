"use client";

import { useMemo } from "react";
import { PageHead } from "@/components/portal/Shell";
import { Card, StatCard, Disclaimer, Badge } from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  BRL,
  pct,
  operationTypeLabel,
} from "@/lib/format";
import type { OperationType } from "@/lib/types";

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function RelatoriosPage() {
  const { state, currentClient } = useApp();
  const client = currentClient();

  const data = useMemo(() => {
    if (!client) return null;
    const props = state.proposals.filter((p) => p.clientId === client.id);

    // ---- Monthly anticipated volume (last 6 months) ----
    const now = new Date();
    const months: { key: string; label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: MONTHS[d.getMonth()],
        total: 0,
      });
    }
    const idx = new Map(months.map((m, i) => [m.key, i]));
    for (const p of props) {
      const d = new Date(p.data);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const i = idx.get(key);
      if (i !== undefined) months[i].total += p.valorBruto;
    }
    // Synthesize a plausible series if data is sparse
    const populated = months.filter((m) => m.total > 0).length;
    if (populated < 3) {
      const base =
        props.reduce((a, p) => a + p.valorBruto, 0) / Math.max(1, props.length) ||
        80000;
      const factors = [0.55, 0.7, 0.62, 0.85, 0.95, 1];
      months.forEach((m, i) => {
        if (m.total === 0) m.total = Math.round(base * factors[i] * (1 + i * 0.18));
      });
    }

    // ---- Status counts ----
    const enviados = props.length;
    const aprovados = props.filter((p) =>
      ["aprovado", "formalizacao", "liberado", "liquidado"].includes(p.status)
    ).length;
    const recusados = props.filter((p) => p.status === "recusado").length;
    const taxaMedia = props.length
      ? props.reduce((a, p) => a + p.taxaMensal, 0) / props.length
      : 0;

    // ---- Operations by type ----
    const byType = new Map<OperationType, number>();
    for (const p of props)
      byType.set(p.tipoOperacao, (byType.get(p.tipoOperacao) || 0) + 1);
    const typeRows = [...byType.entries()].sort((a, b) => b[1] - a[1]);

    // ---- Top sacados by proposal count ----
    const bySacado = new Map<string, number>();
    for (const p of props)
      bySacado.set(p.sacadoNome, (bySacado.get(p.sacadoNome) || 0) + 1);
    const topSacados = [...bySacado.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // ---- Average term ----
    const prazoMedio = props.length
      ? Math.round(props.reduce((a, p) => a + p.prazoDias, 0) / props.length)
      : 32;

    return {
      months,
      enviados,
      aprovados,
      recusados,
      taxaMedia,
      typeRows,
      topSacados,
      prazoMedio,
      hasProposals: props.length > 0,
    };
  }, [client, state.proposals]);

  if (!client || !data) return null;

  const maxMonth = Math.max(...data.months.map((m) => m.total), 1);
  const maxType = Math.max(...data.typeRows.map((t) => t[1]), 1);
  const maxSacado = Math.max(...data.topSacados.map((t) => t[1]), 1);

  return (
    <>
      <PageHead
        title="Relatórios"
        subtitle="Indicadores visuais da sua operação de fomento mercantil."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Títulos enviados" value={data.enviados} />
        <StatCard label="Títulos aprovados" value={data.aprovados} tone="green" />
        <StatCard label="Títulos recusados" value={data.recusados} tone="red" />
        <StatCard
          label="Taxa média"
          value={pct(data.taxaMedia)}
          hint="a.m. demonstrativa"
          tone="gold"
        />
      </div>

      {/* Monthly anticipated volume */}
      <Card className="mb-6 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-semibold text-navy-900">
            Volume antecipado por mês
          </h2>
          <Badge tone="gold">Últimos 6 meses</Badge>
        </div>
        <div className="flex h-56 items-end justify-between gap-2 sm:gap-4">
          {data.months.map((m) => {
            const h = Math.max(4, Math.round((m.total / maxMonth) * 100));
            return (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-medium text-muted sm:text-xs">
                  {m.total >= 1000
                    ? `R$ ${(m.total / 1000).toFixed(0)}k`
                    : BRL(m.total)}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-navy-900 to-navy-800 transition-all"
                    style={{ height: `${h}%` }}
                    title={BRL(m.total)}
                  />
                </div>
                <span className="text-xs font-semibold text-navy-900">
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Operations by type */}
        <Card className="p-6">
          <h2 className="mb-5 font-serif text-lg font-semibold text-navy-900">
            Operações por tipo
          </h2>
          <div className="space-y-4">
            {data.typeRows.length === 0 && (
              <p className="text-sm text-muted">Nenhuma operação registrada.</p>
            )}
            {data.typeRows.map(([type, count]) => (
              <div key={type}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-navy-900">
                    {operationTypeLabel[type]}
                  </span>
                  <span className="text-muted">{count}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy-900/5">
                  <div
                    className="h-full rounded-full bg-gold-400"
                    style={{ width: `${(count / maxType) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top sacados */}
        <Card className="p-6">
          <h2 className="mb-5 font-serif text-lg font-semibold text-navy-900">
            Sacados mais recorrentes
          </h2>
          <div className="space-y-4">
            {data.topSacados.length === 0 && (
              <p className="text-sm text-muted">Nenhum sacado registrado.</p>
            )}
            {data.topSacados.map(([nome, count]) => (
              <div key={nome}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-navy-900">{nome}</span>
                  <span className="shrink-0 text-muted">
                    {count} {count === 1 ? "título" : "títulos"}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy-900/5">
                  <div
                    className="h-full rounded-full bg-navy-900"
                    style={{ width: `${(count / maxSacado) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Time savings highlight */}
      <Card className="mt-6 overflow-hidden bg-navy-gradient p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/55">
              Economia de tempo
            </p>
            <p className="mt-1 font-serif text-4xl font-semibold text-gold-300">
              ~{data.prazoMedio} dias
            </p>
            <p className="mt-1 text-sm text-white/60">
              de prazo médio antecipados por título — capital de giro disponível
              sem esperar o vencimento.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
            <p className="text-2xl font-bold text-gold-300">{data.aprovados}</p>
            <p className="text-xs text-white/60">títulos antecipados</p>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <Disclaimer>
          Os indicadores apresentados são demonstrativos e podem incluir séries
          sintéticas quando o histórico é insuficiente. Não representam oferta de
          crédito nem resultado contábil oficial.
        </Disclaimer>
      </div>
    </>
  );
}
