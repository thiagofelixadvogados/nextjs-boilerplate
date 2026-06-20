"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import { Card, Button, Badge, Modal, Field, Input, Select, Table, Th, Td, EmptyState, Disclaimer } from "@/components/ui";
import { useApp } from "@/lib/store";
import { formatDate, documentStatusLabel, documentStatusTone } from "@/lib/format";
import type { DocumentStatus } from "@/lib/types";

const TIPOS = [
  "Contrato Social",
  "Cartão CNPJ",
  "Documento dos sócios",
  "Comprovante de endereço",
  "Extrato bancário",
  "Relação de faturamento",
  "Nota fiscal",
  "Duplicata",
  "Cheque",
  "Comprovante de entrega",
  "Outro",
];

const LEGEND: DocumentStatus[] = [
  "recebido",
  "validando",
  "aprovado",
  "pendente-atualizacao",
  "recusado",
];

export default function Documentos() {
  const { state, currentClient, addDocument, toast } = useApp();
  const client = currentClient();
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [nome, setNome] = useState("");

  if (!client) return null;

  const docs = state.documents.filter((d) => d.clientId === client.id);

  const enviar = () => {
    const finalNome = nome.trim() || `${tipo}.pdf`;
    addDocument({ clientId: client.id, nome: finalNome, tipo, status: "recebido" });
    toast(`Documento "${finalNome}" enviado.`, "success");
    setOpen(false);
    setNome("");
    setTipo(TIPOS[0]);
  };

  return (
    <>
      <PageHead
        title="Documentos"
        subtitle="Central de documentos cadastrais e operacionais."
        action={<Button variant="gold" onClick={() => setOpen(true)}>Enviar documento</Button>}
      />

      <Card className="mb-6 p-6">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-navy-900/20 bg-navy-900/[0.02] px-6 py-10 text-center transition hover:border-gold-500 hover:bg-gold-300/10"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900 text-xl text-gold-300">↑</span>
          <span className="font-semibold text-navy-900">Enviar novo documento</span>
          <span className="max-w-md text-sm text-muted">
            Anexe contratos, comprovantes e documentos cadastrais. Formatos aceitos:
            PDF, JPG e PNG.
          </span>
        </button>
      </Card>

      {docs.length === 0 ? (
        <EmptyState
          title="Nenhum documento enviado"
          description="Envie seus documentos cadastrais para agilizar a análise das operações."
          action={<Button variant="gold" onClick={() => setOpen(true)}>Enviar documento</Button>}
        />
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-line">
              <Th>Documento</Th>
              <Th>Tipo</Th>
              <Th>Enviado em</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-b border-line/60 last:border-0">
                <Td className="font-medium text-navy-900">{d.nome}</Td>
                <Td>{d.tipo}</Td>
                <Td>{formatDate(d.uploadedAt)}</Td>
                <Td><Badge tone={documentStatusTone[d.status]}>{documentStatusLabel[d.status]}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Card className="mt-6 p-6">
        <h3 className="text-sm font-semibold text-navy-900">Legenda de status</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEGEND.map((s) => (
            <Badge key={s} tone={documentStatusTone[s]}>{documentStatusLabel[s]}</Badge>
          ))}
        </div>
      </Card>

      <div className="mt-6">
        <Disclaimer>
          Os documentos enviados são tratados conforme a Lei Geral de Proteção de
          Dados (LGPD) e utilizados exclusivamente para análise cadastral, de crédito
          e prevenção à fraude.
        </Disclaimer>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Enviar documento">
        <div className="space-y-4">
          <Field label="Tipo de documento" required>
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Nome do arquivo" hint="Informe o nome do arquivo (ex.: Contrato Social.pdf).">
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={`${tipo}.pdf`} />
          </Field>
          <label className="flex h-11 cursor-pointer items-center justify-between rounded-xl border border-dashed border-navy-900/25 bg-navy-900/[0.02] px-3.5 text-sm text-muted transition hover:border-navy-600 hover:bg-navy-900/5">
            <span className="truncate">{nome || "Selecionar arquivo…"}</span>
            <span className="ml-2 shrink-0 rounded-lg bg-navy-900 px-2.5 py-1 text-xs font-semibold text-white">Anexar</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const fn = e.target.files?.[0]?.name;
                if (fn) setNome(fn);
              }}
            />
          </label>
          <div className="flex gap-3 pt-1">
            <Button variant="gold" className="flex-1" onClick={enviar}>Enviar</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
