"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Card,
  Button,
  Badge,
  Field,
  Input,
  Textarea,
  Select,
  Modal,
  Disclaimer,
  EmptyState,
} from "@/components/ui";
import { useApp } from "@/lib/store";
import { BRL, maskCNPJ, maskCPF, maskPhone, riskLabel, riskTone } from "@/lib/format";
import type { RiskLevel } from "@/lib/types";

const emptyForm = {
  nome: "",
  documento: "",
  tipoDoc: "cnpj" as "cnpj" | "cpf",
  email: "",
  telefone: "",
  endereco: "",
  historico: "",
  limiteInterno: "",
  risco: "baixo" as RiskLevel,
};

export default function SacadosPage() {
  const { state, currentClient, addSacado, updateSacado, toast } = useApp();
  const client = currentClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(emptyForm);

  if (!client) return null;

  const sacados = state.sacados.filter((s) => s.clientId === client.id);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((s) => ({ ...s, [k]: v }));

  const handleDoc = (v: string) =>
    set("documento", f.tipoDoc === "cnpj" ? maskCNPJ(v) : maskCPF(v));

  const submit = () => {
    if (!f.nome.trim()) {
      toast("Informe o nome / razão social do sacado.", "error");
      return;
    }
    if (!f.documento.trim()) {
      toast("Informe o documento (CNPJ/CPF) do sacado.", "error");
      return;
    }
    addSacado({
      clientId: client.id,
      nome: f.nome.trim(),
      documento: f.documento,
      email: f.email.trim(),
      telefone: f.telefone,
      endereco: f.endereco.trim(),
      historico: f.historico.trim(),
      limiteInterno: Number(f.limiteInterno) || 0,
      risco: f.risco,
    });
    toast(`Sacado ${f.nome.trim()} cadastrado.`, "success");
    setF(emptyForm);
    setOpen(false);
  };

  return (
    <>
      <PageHead
        title="Sacados"
        subtitle="Cadastro dos pagadores (devedores) dos seus títulos."
        action={
          <Button variant="gold" onClick={() => setOpen(true)}>
            Novo sacado
          </Button>
        }
      />

      <div className="mb-6">
        <Disclaimer>
          A análise de crédito incide sobre o <strong>sacado</strong> — quem deve
          pagar o título. Os limites internos abaixo são parâmetros indicativos de
          gestão e não representam aprovação de crédito por operação, que está
          sujeita a análise cadastral, documental e de prevenção à fraude.
        </Disclaimer>
      </div>

      {sacados.length === 0 ? (
        <EmptyState
          title="Nenhum sacado cadastrado"
          description="Cadastre seus pagadores para agilizar o envio de títulos e a análise de crédito."
          action={
            <Button variant="gold" onClick={() => setOpen(true)}>
              Cadastrar sacado
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sacados.map((s) => (
            <Card key={s.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-base font-semibold text-navy-900">
                    {s.nome}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{s.documento}</p>
                </div>
                <Badge tone={riskTone[s.risco]}>{riskLabel[s.risco]}</Badge>
              </div>

              <div className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted">E-mail</span>
                  <span className="truncate font-medium text-navy-900">
                    {s.email || "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Telefone</span>
                  <span className="font-medium text-navy-900">
                    {s.telefone || "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-3 border-t border-line/60 pt-1.5">
                  <span className="text-muted">Limite interno</span>
                  <span className="font-semibold text-navy-900">
                    {BRL(s.limiteInterno)}
                  </span>
                </div>
              </div>

              {s.historico && (
                <p className="mt-3 line-clamp-3 rounded-lg bg-navy-900/5 px-3 py-2 text-xs leading-relaxed text-muted">
                  {s.historico}
                </p>
              )}

              <div className="mt-4 border-t border-line/60 pt-3">
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  Editar risco
                </label>
                <Select
                  value={s.risco}
                  onChange={(e) => {
                    updateSacado(s.id, { risco: e.target.value as RiskLevel });
                    toast(
                      `Risco de ${s.nome} atualizado para ${riskLabel[
                        e.target.value as RiskLevel
                      ]}.`,
                      "info"
                    );
                  }}
                  className="h-9 py-1.5"
                >
                  <option value="baixo">Baixo</option>
                  <option value="medio">Médio</option>
                  <option value="alto">Alto</option>
                  <option value="bloqueado">Bloqueado</option>
                </Select>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Novo sacado"
        maxWidth="max-w-xl"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nome / Razão Social" required>
              <Input
                value={f.nome}
                onChange={(e) => set("nome", e.target.value)}
                placeholder="Quem deve pagar o título"
              />
            </Field>
          </div>
          <Field label="Tipo de documento">
            <Select
              value={f.tipoDoc}
              onChange={(e) => {
                const tipo = e.target.value as "cnpj" | "cpf";
                setF((s) => ({ ...s, tipoDoc: tipo, documento: "" }));
              }}
            >
              <option value="cnpj">CNPJ</option>
              <option value="cpf">CPF</option>
            </Select>
          </Field>
          <Field label={f.tipoDoc === "cnpj" ? "CNPJ" : "CPF"} required>
            <Input
              value={f.documento}
              onChange={(e) => handleDoc(e.target.value)}
              placeholder={f.tipoDoc === "cnpj" ? "00.000.000/0000-00" : "000.000.000-00"}
            />
          </Field>
          <Field label="E-mail">
            <Input
              type="email"
              value={f.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="financeiro@empresa.com"
            />
          </Field>
          <Field label="Telefone">
            <Input
              value={f.telefone}
              onChange={(e) => set("telefone", maskPhone(e.target.value))}
              placeholder="(00) 00000-0000"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Endereço">
              <Input
                value={f.endereco}
                onChange={(e) => set("endereco", e.target.value)}
                placeholder="Logradouro, número — cidade/UF"
              />
            </Field>
          </div>
          <Field label="Limite interno (R$)">
            <Input
              type="number"
              min={0}
              value={f.limiteInterno}
              onChange={(e) => set("limiteInterno", e.target.value)}
              placeholder="0"
            />
          </Field>
          <Field label="Risco">
            <Select
              value={f.risco}
              onChange={(e) => set("risco", e.target.value as RiskLevel)}
            >
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
              <option value="bloqueado">Bloqueado</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Histórico / observações">
              <Textarea
                rows={3}
                value={f.historico}
                onChange={(e) => set("historico", e.target.value)}
                placeholder="Comportamento de pagamento, relacionamento, restrições conhecidas…"
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="gold" onClick={submit}>
            Salvar sacado
          </Button>
        </div>
      </Modal>
    </>
  );
}
