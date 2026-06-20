"use client";

import Link from "next/link";
import { PageHead } from "@/components/portal/Shell";
import { Card, StatCard, Badge, Button, Disclaimer, Table, Th, Td } from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  BRL, pct, formatDate, proposalStatusLabel, proposalStatusTone,
  operationStatusLabel, operationStatusTone,
} from "@/lib/format";

export default function Dashboard() {
  const { state, currentClient } = useApp();
  const client = currentClient();
  if (!client) return null;

  const props = state.proposals.filter((p) => p.clientId === client.id);
  const ops = state.operations.filter((o) => o.clientId === client.id);

  const volumeEnviado = props.reduce((a, p) => a + p.valorBruto, 0);
  const aprovados = props.filter((p) => ["aprovado", "formalizacao", "liberado", "liquidado"].includes(p.status));
  const valorAprovado = aprovados.reduce((a, p) => a + p.valorBruto, 0);
  const liberados = props.filter((p) => ["liberado", "liquidado"].includes(p.status));
  const valorLiberado = liberados.reduce((a, p) => a + p.valorLiquido, 0);
  const emAberto = ops.filter((o) => o.status === "em-aberto" || o.status === "atrasado");
  const liquidados = ops.filter((o) => o.status === "liquidado");
  const recusados = props.filter((p) => p.status === "recusado");
  const taxaMedia = props.length ? props.reduce((a, p) => a + p.taxaMensal, 0) / props.length : 0;
  const proxima = [...emAberto].sort((a, b) => +new Date(a.vencimento) - +new Date(b.vencimento))[0];

  const recentes = [...props].slice(0, 5);

  return (
    <>
      <PageHead
        title={`Olá, ${client.nomeFantasia}`}
        subtitle="Visão geral da sua operação de fomento mercantil."
        action={<Button href="/app/simular" variant="gold">Simular operação</Button>}
      />

      {/* Pre-approved highlight */}
      <Card className="mb-6 overflow-hidden bg-navy-gradient p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/55">Limite pré-aprovado simulado</p>
            <p className="mt-1 font-serif text-4xl font-semibold text-gold-300">{BRL(client.limitePreAprovado)}</p>
            <p className="mt-1 text-sm text-white/60">Sujeito à análise por operação · status do cadastro: {client.status}</p>
          </div>
          <Button href="/app/titulos" variant="gold">Enviar título</Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Volume enviado" value={BRL(volumeEnviado)} hint={`${props.length} títulos`} />
        <StatCard label="Valor aprovado" value={BRL(valorAprovado)} tone="green" />
        <StatCard label="Valor liberado" value={BRL(valorLiberado)} tone="gold" />
        <StatCard label="Taxa média" value={pct(taxaMedia)} hint="a.m. demonstrativa" />
        <StatCard label="Títulos em aberto" value={emAberto.length} />
        <StatCard label="Títulos liquidados" value={liquidados.length} tone="green" />
        <StatCard label="Títulos recusados" value={recusados.length} tone="red" />
        <StatCard label="Próxima liquidação" value={proxima ? formatDate(proxima.vencimento) : "—"} hint={proxima ? proxima.sacadoNome : undefined} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-navy-900">Propostas recentes</h2>
            <Link href="/app/propostas" className="text-sm font-medium text-gold-600 hover:underline">Ver todas →</Link>
          </div>
          <Table>
            <thead>
              <tr className="border-b border-line">
                <Th>Proposta</Th><Th>Sacado</Th><Th>Valor bruto</Th><Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((p) => (
                <tr key={p.id} className="border-b border-line/60 last:border-0">
                  <Td className="font-medium text-navy-900">{p.numero}</Td>
                  <Td>{p.sacadoNome}</Td>
                  <Td>{BRL(p.valorBruto)}</Td>
                  <Td><Badge tone={proposalStatusTone[p.status]}>{proposalStatusLabel[p.status]}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Card className="p-5">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Operações ativas</h2>
          <div className="mt-4 space-y-3">
            {emAberto.length === 0 && <p className="text-sm text-muted">Nenhuma operação ativa.</p>}
            {emAberto.map((o) => (
              <div key={o.id} className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy-900">{o.codigo}</span>
                  <Badge tone={operationStatusTone[o.status]}>{operationStatusLabel[o.status]}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted">{o.sacadoNome}</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted">Pendente</span>
                  <span className="font-medium text-navy-900">{BRL(o.valorPendente)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Vence {formatDate(o.vencimento)}{o.diasAtraso > 0 && <span className="text-red-600"> · {o.diasAtraso}d em atraso</span>}</p>
              </div>
            ))}
          </div>
          <Button href="/app/operacoes" variant="outline" size="sm" className="mt-4 w-full">Ver operações</Button>
        </Card>
      </div>

      <div className="mt-6">
        <Disclaimer>
          Valores e limites são demonstrativos e não representam oferta de crédito.
          Cada operação está sujeita à análise cadastral, documental, de crédito do
          sacado, prevenção à fraude e às políticas de PLD/FT e LGPD.
        </Disclaimer>
      </div>
    </>
  );
}
