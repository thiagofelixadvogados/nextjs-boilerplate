import type {
  OperationType,
  ReceivableType,
  ProposalStatus,
  OperationStatus,
  DocumentStatus,
  RiskLevel,
  ClientStatus,
  CarteiraStatus,
} from "./types";

export const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const pct = (v: number) =>
  `${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

export const formatDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
};

export const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;

export const operationTypeLabel: Record<OperationType, string> = {
  convencional: "Convencional",
  "sem-recurso": "Sem Recurso",
  "com-recurso": "Com Recurso",
  trustee: "Trustee",
  maturity: "Maturity",
  cartao: "Recebíveis de Cartão",
  exportacao: "Exportação",
};

export const receivableTypeLabel: Record<ReceivableType, string> = {
  duplicata: "Duplicata",
  "nota-fiscal": "Nota Fiscal",
  cheque: "Cheque",
  promissoria: "Promissória",
  cartao: "Recebível de Cartão",
  contrato: "Contrato",
  outro: "Outro",
};

export const proposalStatusLabel: Record<ProposalStatus, string> = {
  recebido: "Recebido",
  "em-analise": "Em análise",
  "pendente-documento": "Pendente de documento",
  aprovado: "Aprovado",
  formalizacao: "Formalização",
  liberado: "Liberado",
  liquidado: "Liquidado",
  recusado: "Recusado",
};

export const operationStatusLabel: Record<OperationStatus, string> = {
  liberado: "Liberado",
  "em-aberto": "Em aberto",
  liquidado: "Liquidado",
  atrasado: "Atrasado",
};

export const documentStatusLabel: Record<DocumentStatus, string> = {
  recebido: "Recebido",
  validando: "Validando",
  aprovado: "Aprovado",
  recusado: "Recusado",
  "pendente-atualizacao": "Pendente atualização",
};

export const riskLabel: Record<RiskLevel, string> = {
  baixo: "Baixo",
  medio: "Médio",
  alto: "Alto",
  bloqueado: "Bloqueado",
};

export const clientStatusLabel: Record<ClientStatus, string> = {
  novo: "Novo",
  "em-analise": "Em análise",
  aprovado: "Aprovado",
  bloqueado: "Bloqueado",
  "pendente-documento": "Pendente documento",
};

export const carteiraStatusLabel: Record<CarteiraStatus, string> = {
  "em-formacao": "Em formação",
  elegivel: "Elegível",
  enviada: "Enviada para securitizadora",
  aprovada: "Aprovada",
  recusada: "Recusada",
  liquidada: "Liquidada",
};

// Badge color tone per status (maps to <Badge tone>)
export type BadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "gold";

export const proposalStatusTone: Record<ProposalStatus, BadgeTone> = {
  recebido: "neutral",
  "em-analise": "info",
  "pendente-documento": "warning",
  aprovado: "success",
  formalizacao: "gold",
  liberado: "success",
  liquidado: "neutral",
  recusado: "danger",
};

export const operationStatusTone: Record<OperationStatus, BadgeTone> = {
  liberado: "info",
  "em-aberto": "warning",
  liquidado: "success",
  atrasado: "danger",
};

export const documentStatusTone: Record<DocumentStatus, BadgeTone> = {
  recebido: "neutral",
  validando: "info",
  aprovado: "success",
  recusado: "danger",
  "pendente-atualizacao": "warning",
};

export const riskTone: Record<RiskLevel, BadgeTone> = {
  baixo: "success",
  medio: "warning",
  alto: "danger",
  bloqueado: "neutral",
};

export const clientStatusTone: Record<ClientStatus, BadgeTone> = {
  novo: "info",
  "em-analise": "warning",
  aprovado: "success",
  bloqueado: "danger",
  "pendente-documento": "warning",
};

export const carteiraStatusTone: Record<CarteiraStatus, BadgeTone> = {
  "em-formacao": "neutral",
  elegivel: "info",
  enviada: "gold",
  aprovada: "success",
  recusada: "danger",
  liquidada: "neutral",
};

/**
 * Demonstrative factoring math. Indicative only — not a credit offer.
 * Returns desagio (discount on face value for the term) + operational fee + net.
 */
export function simulateFactoring(opts: {
  valorBruto: number;
  prazoDias: number;
  taxaMensal: number; // % a.m.
  comRecurso: boolean;
  possuiNF: boolean;
  possuiComprovante: boolean;
}) {
  const { valorBruto, prazoDias, taxaMensal } = opts;
  // risk premium adjustments (demonstrative)
  let taxa = taxaMensal;
  if (!opts.comRecurso) taxa += 0.6; // sem recurso = prêmio de risco
  if (!opts.possuiNF) taxa += 0.3;
  if (!opts.possuiComprovante) taxa += 0.2;

  const taxaDiaria = taxa / 30 / 100;
  const desagio = valorBruto * taxaDiaria * prazoDias;
  const tarifa = Math.max(25, valorBruto * 0.002); // tarifa operacional simulada
  const valorLiquido = Math.max(0, valorBruto - desagio - tarifa);
  // CET demonstrativo anualizado simples
  const custoTotal = desagio + tarifa;
  const cetMensal = valorBruto > 0 ? (custoTotal / valorBruto) * (30 / prazoDias) * 100 : 0;

  return {
    taxaEfetiva: taxa,
    desagio,
    tarifa,
    valorLiquido,
    custoTotal,
    cetMensal,
  };
}

export function maskCNPJ(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function maskCPF(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}
