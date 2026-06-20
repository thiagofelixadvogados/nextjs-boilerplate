"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type {
  AppState,
  Client,
  Sacado,
  Proposal,
  Operation,
  Doc,
  SupportTicket,
  Carteira,
  CurrentUser,
  ProposalStatus,
} from "./types";
import { seedState } from "./mockData";
import { uid } from "./format";

const STORAGE_KEY = "newcapital_state_v1";

const ADMIN = { email: "admin@newcapital.com", password: "admin123" };

interface ToastMsg {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface Ctx {
  ready: boolean;
  state: AppState;
  toasts: ToastMsg[];
  toast: (message: string, type?: ToastMsg["type"]) => void;
  dismissToast: (id: string) => void;
  // auth
  registerClient: (
    data: Omit<Client, "id" | "status" | "limitePreAprovado" | "createdAt">
  ) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  currentClient: () => Client | undefined;
  // mutations
  updateClient: (id: string, patch: Partial<Client>) => void;
  addProposal: (
    p: Omit<Proposal, "id" | "numero" | "data" | "timeline" | "status"> &
      Partial<Pick<Proposal, "status">>
  ) => Proposal;
  updateProposalStatus: (id: string, status: ProposalStatus, note?: string) => void;
  acceptProposal: (id: string) => void;
  addSacado: (s: Omit<Sacado, "id">) => void;
  updateSacado: (id: string, patch: Partial<Sacado>) => void;
  addDocument: (d: Omit<Doc, "id" | "uploadedAt">) => void;
  updateDocument: (id: string, patch: Partial<Doc>) => void;
  addTicket: (t: Omit<SupportTicket, "id" | "data" | "respondido">) => void;
  saveCarteira: (c: Carteira) => void;
  resetDemo: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // persist
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    }
  }, [state, ready]);

  const toast = useCallback((message: string, type: ToastMsg["type"] = "success") => {
    const id = uid("tst");
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback(
    (id: string) => setToasts((t) => t.filter((x) => x.id !== id)),
    []
  );

  const registerClient: Ctx["registerClient"] = (data) => {
    if (state.clients.some((c) => c.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: "Já existe um cadastro com este e-mail." };
    }
    const client: Client = {
      ...data,
      id: uid("cli"),
      status: "novo",
      limitePreAprovado: Math.round((data.volumeRecebiveis || 0) * 0.8),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((s) => ({
      ...s,
      clients: [...s.clients, client],
      currentUser: {
        role: "client",
        clientId: client.id,
        name: client.nomeFantasia || client.razaoSocial,
        email: client.email,
      },
    }));
    return { ok: true };
  };

  const login: Ctx["login"] = (email, password) => {
    const e = email.trim().toLowerCase();
    if (e === ADMIN.email && password === ADMIN.password) {
      setState((s) => ({
        ...s,
        currentUser: { role: "admin", name: "Administrador", email: ADMIN.email },
      }));
      return { ok: true };
    }
    const client = state.clients.find((c) => c.email.toLowerCase() === e);
    if (!client || client.password !== password) {
      return { ok: false, error: "E-mail ou senha inválidos." };
    }
    setState((s) => ({
      ...s,
      currentUser: {
        role: "client",
        clientId: client.id,
        name: client.nomeFantasia || client.razaoSocial,
        email: client.email,
      },
    }));
    return { ok: true };
  };

  const logout = () => setState((s) => ({ ...s, currentUser: null }));

  const currentClient = useCallback(() => {
    const u = state.currentUser;
    if (!u || u.role !== "client") return undefined;
    return state.clients.find((c) => c.id === u.clientId);
  }, [state]);

  const updateClient: Ctx["updateClient"] = (id, patch) =>
    setState((s) => ({
      ...s,
      clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

  const addProposal: Ctx["addProposal"] = (p) => {
    const numero = `NC-2026-${String(state.proposals.length + 1).padStart(4, "0")}`;
    const today = new Date().toISOString().slice(0, 10);
    const proposal: Proposal = {
      ...p,
      id: uid("prop"),
      numero,
      data: today,
      status: p.status ?? "recebido",
      timeline: [
        { date: today, label: "Recebido", detail: "Título recebido pelo portal." },
        { date: today, label: "Em análise", detail: "Análise documental e do sacado iniciada." },
      ],
    } as Proposal;
    setState((s) => ({ ...s, proposals: [proposal, ...s.proposals] }));
    return proposal;
  };

  const updateProposalStatus: Ctx["updateProposalStatus"] = (id, status, note) =>
    setState((s) => ({
      ...s,
      proposals: s.proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              timeline: [
                ...p.timeline,
                {
                  date: new Date().toISOString().slice(0, 10),
                  label: status,
                  detail: note ?? "Status atualizado.",
                },
              ],
            }
          : p
      ),
    }));

  const acceptProposal: Ctx["acceptProposal"] = (id) => {
    setState((s) => {
      const p = s.proposals.find((x) => x.id === id);
      if (!p) return s;
      const today = new Date().toISOString().slice(0, 10);
      const op: Operation = {
        id: uid("op"),
        codigo: `OP-2026-${String(s.operations.length + 1).padStart(4, "0")}`,
        clientId: p.clientId,
        proposalId: p.id,
        valorLiberado: p.valorLiquido,
        dataLiberacao: today,
        vencimento: p.vencimento,
        sacadoNome: p.sacadoNome,
        valorRecebido: 0,
        valorPendente: p.valorBruto,
        diasAtraso: 0,
        status: "em-aberto",
      };
      return {
        ...s,
        proposals: s.proposals.map((x) =>
          x.id === id
            ? {
                ...x,
                status: "liberado",
                timeline: [
                  ...x.timeline,
                  { date: today, label: "Formalização", detail: "Proposta aceita e cessão formalizada." },
                  { date: today, label: "Liberado", detail: "Valor líquido creditado na conta cadastrada." },
                ],
              }
            : x
        ),
        operations: [op, ...s.operations],
      };
    });
  };

  const addSacado: Ctx["addSacado"] = (sd) =>
    setState((s) => ({ ...s, sacados: [{ ...sd, id: uid("sac") }, ...s.sacados] }));

  const updateSacado: Ctx["updateSacado"] = (id, patch) =>
    setState((s) => ({
      ...s,
      sacados: s.sacados.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));

  const addDocument: Ctx["addDocument"] = (d) =>
    setState((s) => ({
      ...s,
      documents: [
        { ...d, id: uid("doc"), uploadedAt: new Date().toISOString().slice(0, 10) },
        ...s.documents,
      ],
    }));

  const updateDocument: Ctx["updateDocument"] = (id, patch) =>
    setState((s) => ({
      ...s,
      documents: s.documents.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));

  const addTicket: Ctx["addTicket"] = (t) =>
    setState((s) => ({
      ...s,
      tickets: [
        { ...t, id: uid("tk"), data: new Date().toISOString().slice(0, 10), respondido: false },
        ...s.tickets,
      ],
    }));

  const saveCarteira: Ctx["saveCarteira"] = (c) =>
    setState((s) => {
      const exists = s.carteiras.some((x) => x.id === c.id);
      return {
        ...s,
        carteiras: exists
          ? s.carteiras.map((x) => (x.id === c.id ? c : x))
          : [c, ...s.carteiras],
      };
    });

  const resetDemo = () => {
    const fresh = seedState();
    setState(fresh);
    toast("Dados de demonstração restaurados.", "info");
  };

  const value: Ctx = {
    ready,
    state,
    toasts,
    toast,
    dismissToast,
    registerClient,
    login,
    logout,
    currentClient,
    updateClient,
    addProposal,
    updateProposalStatus,
    acceptProposal,
    addSacado,
    updateSacado,
    addDocument,
    updateDocument,
    addTicket,
    saveCarteira,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
