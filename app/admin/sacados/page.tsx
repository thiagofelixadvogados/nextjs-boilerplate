"use client";

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
import { BRL, riskLabel, riskTone } from "@/lib/format";
import type { RiskLevel } from "@/lib/types";

const RISKS: RiskLevel[] = ["baixo", "medio", "alto", "bloqueado"];

export default function AdminSacados() {
  const { state, updateSacado, toast } = useApp();

  const clientName = (id: string) =>
    state.clients.find((c) => c.id === id)?.razaoSocial ?? "—";

  const change = (id: string, risco: RiskLevel) => {
    updateSacado(id, { risco });
    toast(`Risco do sacado atualizado para "${riskLabel[risco]}".`);
  };

  const dist = RISKS.map((r) => ({
    risco: r,
    count: state.sacados.filter((s) => s.risco === r).length,
  }));

  return (
    <>
      <PageHead
        title="Sacados"
        subtitle="Base consolidada de sacados e limites internos por risco."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dist.map((d) => (
          <StatCard
            key={d.risco}
            label={`Risco ${riskLabel[d.risco]}`}
            value={d.count}
            tone={d.risco === "baixo" ? "green" : d.risco === "alto" ? "red" : "navy"}
          />
        ))}
      </div>

      {state.sacados.length === 0 ? (
        <EmptyState title="Nenhum sacado" description="Não há sacados cadastrados." />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Sacado</Th>
              <Th>Documento</Th>
              <Th>Cliente</Th>
              <Th>Limite interno</Th>
              <Th>Risco</Th>
              <Th>Alterar risco</Th>
            </tr>
          </thead>
          <tbody>
            {state.sacados.map((s) => (
              <tr key={s.id} className="border-b border-line/60 last:border-0">
                <Td className="font-medium text-navy-900">{s.nome}</Td>
                <Td>{s.documento}</Td>
                <Td>{clientName(s.clientId)}</Td>
                <Td>{BRL(s.limiteInterno)}</Td>
                <Td><Badge tone={riskTone[s.risco]}>{riskLabel[s.risco]}</Badge></Td>
                <Td>
                  <div className="w-40">
                    <Select
                      value={s.risco}
                      onChange={(e) => change(s.id, e.target.value as RiskLevel)}
                    >
                      {RISKS.map((r) => (
                        <option key={r} value={r}>{riskLabel[r]}</option>
                      ))}
                    </Select>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
