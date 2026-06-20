"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Badge,
  Select,
  Table,
  Th,
  Td,
  EmptyState,
} from "@/components/ui";
import { useApp } from "@/lib/store";
import {
  formatDate,
  documentStatusLabel,
  documentStatusTone,
} from "@/lib/format";
import type { DocumentStatus } from "@/lib/types";

const STATUSES: DocumentStatus[] = [
  "recebido",
  "validando",
  "aprovado",
  "recusado",
  "pendente-atualizacao",
];

export default function AdminDocumentos() {
  const { state, updateDocument, toast } = useApp();
  const [filter, setFilter] = useState<DocumentStatus | "todos">("todos");

  const clientName = (id: string) =>
    state.clients.find((c) => c.id === id)?.razaoSocial ?? "—";

  const docs = state.documents.filter(
    (d) => filter === "todos" || d.status === filter
  );

  const change = (id: string, status: DocumentStatus) => {
    updateDocument(id, { status });
    toast(`Documento atualizado para "${documentStatusLabel[status]}".`);
  };

  return (
    <>
      <PageHead
        title="Documentos"
        subtitle="Validação documental de todos os clientes do portal."
        action={
          <div className="w-52">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as DocumentStatus | "todos")}
            >
              <option value="todos">Todos os status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{documentStatusLabel[s]}</option>
              ))}
            </Select>
          </div>
        }
      />

      {docs.length === 0 ? (
        <EmptyState title="Nenhum documento" description="Não há documentos com este status." />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Cliente</Th>
              <Th>Documento</Th>
              <Th>Tipo</Th>
              <Th>Enviado em</Th>
              <Th>Status</Th>
              <Th>Alterar status</Th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-b border-line/60 last:border-0">
                <Td>{clientName(d.clientId)}</Td>
                <Td className="font-medium text-navy-900">{d.nome}</Td>
                <Td>{d.tipo}</Td>
                <Td>{formatDate(d.uploadedAt)}</Td>
                <Td><Badge tone={documentStatusTone[d.status]}>{documentStatusLabel[d.status]}</Badge></Td>
                <Td>
                  <div className="w-48">
                    <Select
                      value={d.status}
                      onChange={(e) => change(d.id, e.target.value as DocumentStatus)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{documentStatusLabel[s]}</option>
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
