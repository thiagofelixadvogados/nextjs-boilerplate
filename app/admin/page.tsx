"use client";

import Link from "next/link";
import { PageHead } from "@/components/portal/Shell";
import { Card, StatCard, Badge, Disclaimer, Table, Th, Td } from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  BRL,
  formatDate,
  clientStatusLabel,
  clientStatusTone,
  proposalStatusLabel,
  proposalStatusTone,
} from "@/lib/format";

export default function AdminDashboard() {
  const { state } = useApp();

  const clients = state.clients;
  const pendentes = clients.filter((c) =>
    ["novo", "em-analise", "pendente-documento"].includes(c.status)
  );

  const volumeEnviado = state.proposals.reduce((a, p) => a + p.valorBruto, 0);
  const aprovados = state.proposals.filter((p) =>
    ["aprovado", "formalizacao", "liberado", "liquidado"].includes(p.status)
  );
  const volumeAprovado = aprovados.reduce((a, p) => a + p.valorBruto, 0);
  const volumeLiberado = state.proposals
    .filter((p) => ["liberado", "liquidado"].includes(p.status))
    .reduce((a, p) => a + p.valorLiquido, 0);
  const emAnalise = state.proposals.filter((p) =>
    ["recebido", "em-analise", "pendente-documento"].includes(p.status)
  ).length;
  const emAtraso = state.operations.filter((o) => o.diasAtraso > 0).length;

  const riskCounts = state.sacados.reduce(
    (acc, s) => {
      acc[s.risco] = (acc[s.risco] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const totalSac = state.sacados.length || 1;
  const baixoShare = (riskCounts["baixo"] || 0) / totalSac;
  const altoShare = (riskCounts["alto"] || 0) / totalSac;
  const riscoMedioTexto =
    altoShare > 0.34 ? "Elevado" : baixoShare >= 0.5 ? "Baixo" : "Moderado";

  const receitaEstimada = state.proposals.reduce(
    (a, p) => a + p.desagio + p.tarifa,
    0
  );
  const carteiraSecuritizadora = state.carteiras.reduce(
    (a, c) => a + c.valorTotal,
    0
  );

  const recentClients = [...clients]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);
  const recentProposals = [...state.proposals]
    .sort((a, b) => +new Date(b.data) - +new Date(a.data))
    .slice(0, 6);

  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.razaoSocial ?? "—";

  return (
    <>
      <PageHead
        title="Painel administrativo"
        subtitle="Visão consolidada de clientes, títulos, operações e carteiras — New Capital Fomento Mercantil Ltda."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de clientes" value={clients.length} hint={`${pendentes.length} pendentes`} />
        <StatCard label="Clientes pendentes" value={pendentes.length} tone="red" />
        <StatCard label="Volume enviado" value={BRL(volumeEnviado)} />
        <StatCard label="Volume aprovado" value={BRL(volumeAprovado)} tone="green" />
        <StatCard label="Volume liberado" value={BRL(volumeLiberado)} tone="gold" />
        <StatCard label="Títulos em análise" value={emAnalise} />
        <StatCard label="Operações em atraso" value={emAtraso} tone="red" />
        <StatCard label="Risco médio da base" value={riscoMedioTexto} hint={`${state.sacados.length} sacados`} />
        <StatCard label="Receita estimada" value={BRL(receitaEstimada)} tone="green" hint="deságio + tarifas" />
        <StatCard label="Carteira p/ securitizadora" value={BRL(carteiraSecuritizadora)} tone="gold" hint={`${state.carteiras.length} carteiras`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-navy-900">Clientes recentes</h2>
            <Link href="/admin/clientes" className="text-sm font-medium text-gold-600 hover:underline">Ver todos →</Link>
          </div>
          <Table>
            <thead>
              <tr className="border-b border-line">
                <Th>Razão social</Th><Th>Cidade/UF</Th><Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map((c) => (
                <tr key={c.id} className="border-b border-line/60 last:border-0">
                  <Td className="font-medium text-navy-900">{c.razaoSocial}</Td>
                  <Td>{c.cidade}/{c.estado}</Td>
                  <Td><Badge tone={clientStatusTone[c.status]}>{clientStatusLabel[c.status]}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-navy-900">Propostas recentes</h2>
            <Link href="/admin/propostas" className="text-sm font-medium text-gold-600 hover:underline">Ver todas →</Link>
          </div>
          <Table>
            <thead>
              <tr className="border-b border-line">
                <Th>Proposta</Th><Th>Cliente</Th><Th>Valor</Th><Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {recentProposals.map((p) => (
                <tr key={p.id} className="border-b border-line/60 last:border-0">
                  <Td className="font-medium text-navy-900">{p.numero}</Td>
                  <Td>{clientName(p.clientId)}</Td>
                  <Td>{BRL(p.valorBruto)}</Td>
                  <Td><Badge tone={proposalStatusTone[p.status]}>{proposalStatusLabel[p.status]}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="mt-6">
        <Disclaimer>
          Ambiente demonstrativo. Os números consolidados são simulados e não
          representam posições reais. Toda operação está sujeita à análise
          cadastral, documental, de crédito do sacado, prevenção à fraude e às
          políticas de PLD/FT e LGPD.
        </Disclaimer>
      </div>
    </>
  );
}
