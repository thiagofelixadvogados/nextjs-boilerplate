// ============================================================================
// Fluxo Prime Fomento S/A — Domain types
// ============================================================================

export type Role = "client" | "admin";

export type OperationType =
  | "convencional"
  | "sem-recurso"
  | "com-recurso"
  | "trustee"
  | "maturity"
  | "cartao"
  | "exportacao";

export type ReceivableType =
  | "duplicata"
  | "nota-fiscal"
  | "cheque"
  | "promissoria"
  | "cartao"
  | "contrato"
  | "outro";

export type ProposalStatus =
  | "recebido"
  | "em-analise"
  | "pendente-documento"
  | "aprovado"
  | "formalizacao"
  | "liberado"
  | "liquidado"
  | "recusado";

export type OperationStatus =
  | "liberado"
  | "em-aberto"
  | "liquidado"
  | "atrasado";

export type DocumentStatus =
  | "recebido"
  | "validando"
  | "aprovado"
  | "recusado"
  | "pendente-atualizacao";

export type RiskLevel = "baixo" | "medio" | "alto" | "bloqueado";

export type ClientStatus =
  | "novo"
  | "em-analise"
  | "aprovado"
  | "bloqueado"
  | "pendente-documento";

export type CarteiraStatus =
  | "em-formacao"
  | "elegivel"
  | "enviada"
  | "aprovada"
  | "recusada"
  | "liquidada";

export interface Partner {
  nome: string;
  cpf: string;
  rg: string;
  nascimento: string;
  telefone: string;
  email: string;
  percentual: number;
}

export interface BankData {
  banco: string;
  agencia: string;
  conta: string;
  pix: string;
  titularidade: string;
}

export interface Client {
  id: string;
  // auth
  email: string;
  password: string;
  // empresa
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  site: string;
  faturamentoMensal: number;
  volumeRecebiveis: number;
  segmento: string;
  // relacionados
  socios: Partner[];
  banco: BankData;
  status: ClientStatus;
  limitePreAprovado: number;
  createdAt: string;
}

export interface Sacado {
  id: string;
  clientId: string;
  nome: string;
  documento: string; // CNPJ/CPF
  email: string;
  telefone: string;
  endereco: string;
  historico: string;
  limiteInterno: number;
  risco: RiskLevel;
}

export interface AnalysisEvent {
  date: string;
  label: string;
  detail: string;
}

export interface Proposal {
  id: string;
  numero: string;
  clientId: string;
  data: string;
  tipoOperacao: OperationType;
  tipoRecebivel: ReceivableType;
  comRecurso: boolean;
  numeroTitulo: string;
  sacadoNome: string;
  sacadoDoc: string;
  sacadoEmail: string;
  sacadoTelefone: string;
  valorBruto: number;
  prazoDias: number;
  vencimento: string;
  taxaMensal: number;
  desagio: number;
  tarifa: number;
  valorLiquido: number;
  descricao: string;
  possuiNF: boolean;
  possuiComprovante: boolean;
  status: ProposalStatus;
  timeline: AnalysisEvent[];
}

export interface Operation {
  id: string;
  codigo: string;
  clientId: string;
  proposalId: string;
  valorLiberado: number;
  dataLiberacao: string;
  vencimento: string;
  sacadoNome: string;
  valorRecebido: number;
  valorPendente: number;
  diasAtraso: number;
  status: OperationStatus;
}

export interface Doc {
  id: string;
  clientId: string;
  nome: string;
  tipo: string;
  status: DocumentStatus;
  uploadedAt: string;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  assunto: string;
  categoria: string;
  mensagem: string;
  data: string;
  respondido: boolean;
}

export interface Carteira {
  id: string;
  nome: string;
  operationIds: string[];
  valorTotal: number;
  prazoMedio: number;
  taxaMedia: number;
  riscoMedio: RiskLevel;
  status: CarteiraStatus;
}

export interface CurrentUser {
  role: Role;
  clientId?: string; // present for client role
  name: string;
  email: string;
}

export interface AppState {
  clients: Client[];
  sacados: Sacado[];
  proposals: Proposal[];
  operations: Operation[];
  documents: Doc[];
  tickets: SupportTicket[];
  carteiras: Carteira[];
  currentUser: CurrentUser | null;
}
