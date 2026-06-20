"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Badge,
  Button,
  Field,
  Select,
  Modal,
  Table,
  Th,
  Td,
  EmptyState,
} from "@/components/ui";
import { useApp } from "@/lib/store";
import { BRL, clientStatusLabel, clientStatusTone } from "@/lib/format";
import type { Client, ClientStatus } from "@/lib/types";

const STATUSES: ClientStatus[] = [
  "novo",
  "em-analise",
  "aprovado",
  "bloqueado",
  "pendente-documento",
];

export default function AdminClientes() {
  const { state, updateClient, toast } = useApp();
  const [filter, setFilter] = useState<ClientStatus | "todos">("todos");
  const [selected, setSelected] = useState<Client | null>(null);

  const clients = state.clients.filter(
    (c) => filter === "todos" || c.status === filter
  );

  const changeStatus = (id: string, status: ClientStatus) => {
    updateClient(id, { status });
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
    toast(`Status do cliente atualizado para "${clientStatusLabel[status]}".`);
  };

  return (
    <>
      <PageHead
        title="Clientes"
        subtitle="Base completa de empresas cadastradas no portal."
        action={
          <div className="w-48">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ClientStatus | "todos")}
            >
              <option value="todos">Todos os status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {clientStatusLabel[s]}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      {clients.length === 0 ? (
        <EmptyState title="Nenhum cliente" description="Não há clientes com este status." />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Razão social</Th>
              <Th>CNPJ</Th>
              <Th>Cidade/UF</Th>
              <Th>Faturamento mensal</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-line/60 last:border-0">
                <Td className="font-medium text-navy-900">{c.razaoSocial}</Td>
                <Td>{c.cnpj}</Td>
                <Td>{c.cidade}/{c.estado}</Td>
                <Td>{BRL(c.faturamentoMensal)}</Td>
                <Td><Badge tone={clientStatusTone[c.status]}>{clientStatusLabel[c.status]}</Badge></Td>
                <Td>
                  <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                    Ver
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.razaoSocial}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Empresa</h4>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><dt className="text-muted">Nome fantasia</dt><dd className="font-medium text-navy-900">{selected.nomeFantasia || "—"}</dd></div>
                <div><dt className="text-muted">CNPJ</dt><dd className="font-medium text-navy-900">{selected.cnpj}</dd></div>
                <div><dt className="text-muted">Segmento</dt><dd className="font-medium text-navy-900">{selected.segmento || "—"}</dd></div>
                <div><dt className="text-muted">Cidade/UF</dt><dd className="font-medium text-navy-900">{selected.cidade}/{selected.estado}</dd></div>
                <div><dt className="text-muted">Telefone</dt><dd className="font-medium text-navy-900">{selected.telefone}</dd></div>
                <div><dt className="text-muted">E-mail</dt><dd className="font-medium text-navy-900">{selected.email}</dd></div>
                <div><dt className="text-muted">Faturamento mensal</dt><dd className="font-medium text-navy-900">{BRL(selected.faturamentoMensal)}</dd></div>
                <div><dt className="text-muted">Volume de recebíveis</dt><dd className="font-medium text-navy-900">{BRL(selected.volumeRecebiveis)}</dd></div>
                <div><dt className="text-muted">Limite pré-aprovado</dt><dd className="font-medium text-navy-900">{BRL(selected.limitePreAprovado)}</dd></div>
              </dl>
            </section>

            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Sócios</h4>
              <div className="space-y-2">
                {selected.socios.map((s, i) => (
                  <div key={i} className="rounded-xl border border-line p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-navy-900">{s.nome}</span>
                      <span className="text-muted">{s.percentual}%</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">CPF {s.cpf} · {s.email}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Dados bancários</h4>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><dt className="text-muted">Banco</dt><dd className="font-medium text-navy-900">{selected.banco.banco}</dd></div>
                <div><dt className="text-muted">Agência</dt><dd className="font-medium text-navy-900">{selected.banco.agencia}</dd></div>
                <div><dt className="text-muted">Conta</dt><dd className="font-medium text-navy-900">{selected.banco.conta}</dd></div>
                <div><dt className="text-muted">PIX</dt><dd className="font-medium text-navy-900">{selected.banco.pix}</dd></div>
              </dl>
            </section>

            <section>
              <Field label="Status do cadastro">
                <Select
                  value={selected.status}
                  onChange={(e) => changeStatus(selected.id, e.target.value as ClientStatus)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{clientStatusLabel[s]}</option>
                  ))}
                </Select>
              </Field>
            </section>
          </div>
        )}
      </Modal>
    </>
  );
}
