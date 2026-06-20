"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHead } from "@/components/portal/Shell";
import { Card, Field, Input, Textarea, Select, Button, Disclaimer, Badge } from "@/components/ui";
import { useApp } from "@/lib/store";
import { BRL, simulateFactoring, maskCNPJ, maskPhone, proposalStatusLabel, proposalStatusTone } from "@/lib/format";
import type { OperationType, ReceivableType, ProposalStatus } from "@/lib/types";

const STATUS_FLOW: ProposalStatus[] = [
  "recebido",
  "em-analise",
  "aprovado",
  "pendente-documento",
  "recusado",
  "formalizacao",
  "liberado",
  "liquidado",
];

const empty = {
  tipoRecebivel: "duplicata" as ReceivableType,
  tipoOperacao: "convencional" as OperationType,
  numeroTitulo: "",
  valor: "",
  vencimento: "",
  sacadoNome: "",
  sacadoDoc: "",
  sacadoEmail: "",
  sacadoTelefone: "",
  descricao: "",
  observacoes: "",
};

export default function Titulos() {
  const { addProposal, toast, currentClient } = useApp();
  const router = useRouter();
  const client = currentClient();

  const [f, setF] = useState(empty);
  const [docName, setDocName] = useState("");
  const [comprovanteName, setComprovanteName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!client) return null;

  const set = (k: keyof typeof empty, v: string) => setF((s) => ({ ...s, [k]: v }));

  const reset = () => {
    setF(empty);
    setDocName("");
    setComprovanteName("");
    setErrors({});
  };

  const enviar = () => {
    const errs: Record<string, string> = {};
    if (!f.numeroTitulo.trim()) errs.numeroTitulo = "Informe o número do título.";
    if (!f.valor || Number(f.valor) <= 0) errs.valor = "Informe um valor válido.";
    if (!f.sacadoNome.trim()) errs.sacadoNome = "Informe o nome do sacado.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast("Verifique os campos obrigatórios.", "error");
      return;
    }

    const valorBruto = Number(f.valor) || 0;
    const venc = f.vencimento || new Date(Date.now() + 45 * 864e5).toISOString().slice(0, 10);
    const prazoDias = Math.max(
      1,
      Math.round((+new Date(venc) - Date.now()) / 864e5) || 45
    );
    const taxaMensal = 2.5;
    const comRecurso = f.tipoOperacao !== "sem-recurso";
    const possuiNF = !!docName;
    const possuiComprovante = !!comprovanteName;

    const sim = simulateFactoring({
      valorBruto,
      prazoDias,
      taxaMensal,
      comRecurso,
      possuiNF,
      possuiComprovante,
    });

    const p = addProposal({
      clientId: client.id,
      tipoOperacao: f.tipoOperacao,
      tipoRecebivel: f.tipoRecebivel,
      comRecurso,
      numeroTitulo: f.numeroTitulo.trim(),
      sacadoNome: f.sacadoNome.trim(),
      sacadoDoc: f.sacadoDoc,
      sacadoEmail: f.sacadoEmail.trim(),
      sacadoTelefone: f.sacadoTelefone,
      valorBruto,
      prazoDias,
      vencimento: venc,
      taxaMensal: sim.taxaEfetiva,
      desagio: Math.round(sim.desagio),
      tarifa: Math.round(sim.tarifa),
      valorLiquido: Math.round(sim.valorLiquido),
      descricao: f.descricao.trim() || "Título enviado pelo portal.",
      possuiNF,
      possuiComprovante,
    });

    toast(`Título ${p.numero} enviado para análise.`, "success");
    reset();
    router.push("/app/propostas");
  };

  return (
    <>
      <PageHead
        title="Enviar títulos"
        subtitle="Submeta um recebível para antecipação e acompanhe a análise."
        action={<Button href="/app/propostas" variant="outline">Minhas propostas</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">Dados do título</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de recebível" required>
              <Select value={f.tipoRecebivel} onChange={(e) => set("tipoRecebivel", e.target.value)}>
                <option value="duplicata">Duplicata</option>
                <option value="nota-fiscal">Nota Fiscal</option>
                <option value="cheque">Cheque</option>
                <option value="promissoria">Promissória</option>
                <option value="cartao">Recebível de Cartão</option>
                <option value="contrato">Contrato</option>
                <option value="outro">Outro</option>
              </Select>
            </Field>
            <Field label="Tipo de operação" required>
              <Select value={f.tipoOperacao} onChange={(e) => set("tipoOperacao", e.target.value)}>
                <option value="convencional">Convencional</option>
                <option value="sem-recurso">Sem Recurso</option>
                <option value="com-recurso">Com Recurso</option>
              </Select>
            </Field>
            <Field label="Número do título" required error={errors.numeroTitulo}>
              <Input value={f.numeroTitulo} onChange={(e) => set("numeroTitulo", e.target.value)} placeholder="Ex.: DUP-55012" />
            </Field>
            <Field label="Valor (R$)" required error={errors.valor}>
              <Input type="number" min="0" step="0.01" value={f.valor} onChange={(e) => set("valor", e.target.value)} placeholder="0,00" />
            </Field>
            <Field label="Vencimento">
              <Input type="date" value={f.vencimento} onChange={(e) => set("vencimento", e.target.value)} />
            </Field>
            <Field label="Sacado (nome)" required error={errors.sacadoNome}>
              <Input value={f.sacadoNome} onChange={(e) => set("sacadoNome", e.target.value)} placeholder="Quem deve pagar o título" />
            </Field>
            <Field label="CNPJ do sacado">
              <Input value={f.sacadoDoc} onChange={(e) => set("sacadoDoc", maskCNPJ(e.target.value))} placeholder="00.000.000/0000-00" />
            </Field>
            <Field label="E-mail do sacado">
              <Input type="email" value={f.sacadoEmail} onChange={(e) => set("sacadoEmail", e.target.value)} placeholder="financeiro@sacado.com.br" />
            </Field>
            <Field label="Telefone do sacado">
              <Input value={f.sacadoTelefone} onChange={(e) => set("sacadoTelefone", maskPhone(e.target.value))} placeholder="(00) 00000-0000" />
            </Field>
          </div>

          <div className="mt-4 grid gap-4">
            <Field label="Descrição da operação">
              <Textarea rows={2} value={f.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Ex.: Venda de mercadorias — pedido 99812." />
            </Field>
          </div>

          <h3 className="mb-3 mt-6 font-serif text-base font-semibold text-navy-900">Documentos</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Documento do título" hint={docName ? `Selecionado: ${docName}` : "Nota fiscal, duplicata ou contrato."}>
              <label className="flex h-11 cursor-pointer items-center justify-between rounded-xl border border-dashed border-navy-900/25 bg-navy-900/[0.02] px-3.5 text-sm text-muted transition hover:border-navy-600 hover:bg-navy-900/5">
                <span className="truncate">{docName || "Selecionar arquivo…"}</span>
                <span className="ml-2 shrink-0 rounded-lg bg-navy-900 px-2.5 py-1 text-xs font-semibold text-white">Anexar</span>
                <input type="file" className="hidden" onChange={(e) => setDocName(e.target.files?.[0]?.name ?? "")} />
              </label>
            </Field>
            <Field label="Comprovante de entrega" hint={comprovanteName ? `Selecionado: ${comprovanteName}` : "Canhoto, AR ou protocolo."}>
              <label className="flex h-11 cursor-pointer items-center justify-between rounded-xl border border-dashed border-navy-900/25 bg-navy-900/[0.02] px-3.5 text-sm text-muted transition hover:border-navy-600 hover:bg-navy-900/5">
                <span className="truncate">{comprovanteName || "Selecionar arquivo…"}</span>
                <span className="ml-2 shrink-0 rounded-lg bg-navy-900 px-2.5 py-1 text-xs font-semibold text-white">Anexar</span>
                <input type="file" className="hidden" onChange={(e) => setComprovanteName(e.target.files?.[0]?.name ?? "")} />
              </label>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Observações">
              <Textarea rows={3} value={f.observacoes} onChange={(e) => set("observacoes", e.target.value)} placeholder="Informações adicionais para a análise." />
            </Field>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" onClick={enviar}>Enviar título para análise</Button>
            <Button variant="ghost" size="lg" onClick={reset}>Limpar formulário</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="font-serif text-lg font-semibold text-navy-900">Como funciona a análise</h2>
            <p className="mt-2 text-sm text-muted">
              Após o envio, seu título passa pelas seguintes etapas até a liquidação:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {STATUS_FLOW.map((s) => (
                <Badge key={s} tone={proposalStatusTone[s]}>{proposalStatusLabel[s]}</Badge>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              Acompanhe o andamento em tempo real na página de propostas, incluindo a
              linha do tempo de cada etapa e eventuais pendências documentais.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-serif text-base font-semibold text-navy-900">Resumo demonstrativo</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Valor informado</span>
                <span className="font-medium text-navy-900">{BRL(Number(f.valor) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Taxa base</span>
                <span className="font-medium text-navy-900">2,50% a.m.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Modalidade</span>
                <span className="font-medium text-navy-900">{f.tipoOperacao === "sem-recurso" ? "Sem recurso" : "Com recurso"}</span>
              </div>
            </div>
          </Card>

          <Disclaimer>
            O envio do título não representa contratação. As condições finais dependem
            de análise cadastral, documental, de crédito do sacado, prevenção à fraude
            e às políticas de PLD/FT e LGPD da New Capital.
          </Disclaimer>
        </div>
      </div>
    </>
  );
}
