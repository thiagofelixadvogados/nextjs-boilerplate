"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import {
  Card,
  Button,
  Badge,
  Field,
  Input,
  Disclaimer,
} from "@/components/ui";
import { useApp } from "@/lib/store";
import { BRL, maskCNPJ, maskCPF, maskPhone, pct } from "@/lib/format";

type Tab = "empresa" | "bancarios" | "seguranca" | "notificacoes";

const TABS: { key: Tab; label: string }[] = [
  { key: "empresa", label: "Dados da empresa" },
  { key: "bancarios", label: "Dados bancários" },
  { key: "notificacoes", label: "Notificações" },
  { key: "seguranca", label: "Segurança" },
];

export default function PerfilPage() {
  const { currentClient, updateClient, toast } = useApp();
  const client = currentClient();

  const [tab, setTab] = useState<Tab>("empresa");

  // Company data
  const [empresa, setEmpresa] = useState(() => ({
    razaoSocial: client?.razaoSocial ?? "",
    nomeFantasia: client?.nomeFantasia ?? "",
    cnpj: client?.cnpj ?? "",
    telefone: client?.telefone ?? "",
    site: client?.site ?? "",
    segmento: client?.segmento ?? "",
    faturamentoMensal: String(client?.faturamentoMensal ?? ""),
    volumeRecebiveis: String(client?.volumeRecebiveis ?? ""),
    endereco: client?.endereco ?? "",
    cidade: client?.cidade ?? "",
    estado: client?.estado ?? "",
    cep: client?.cep ?? "",
  }));

  // Bank data
  const [banco, setBanco] = useState(() => ({
    banco: client?.banco.banco ?? "",
    agencia: client?.banco.agencia ?? "",
    conta: client?.banco.conta ?? "",
    pix: client?.banco.pix ?? "",
    titularidade: client?.banco.titularidade ?? "",
  }));

  // Security
  const [senha, setSenha] = useState({ atual: "", nova: "", confirma: "" });

  // Notification prefs (visual, local only)
  const [prefs, setPrefs] = useState({
    propostas: true,
    operacoes: true,
    documentos: true,
    marketing: false,
  });

  if (!client) return null;

  const setE = <K extends keyof typeof empresa>(k: K, v: string) =>
    setEmpresa((s) => ({ ...s, [k]: v }));
  const setB = <K extends keyof typeof banco>(k: K, v: string) =>
    setBanco((s) => ({ ...s, [k]: v }));

  const salvarEmpresa = () => {
    updateClient(client.id, {
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia,
      cnpj: empresa.cnpj,
      telefone: empresa.telefone,
      site: empresa.site,
      segmento: empresa.segmento,
      faturamentoMensal: Number(empresa.faturamentoMensal) || 0,
      volumeRecebiveis: Number(empresa.volumeRecebiveis) || 0,
      endereco: empresa.endereco,
      cidade: empresa.cidade,
      estado: empresa.estado,
      cep: empresa.cep,
    });
    toast("Dados da empresa atualizados.", "success");
  };

  const salvarBanco = () => {
    updateClient(client.id, { banco: { ...banco } });
    toast("Dados bancários atualizados.", "success");
  };

  const salvarSenha = () => {
    if (!senha.atual) {
      toast("Informe a senha atual.", "error");
      return;
    }
    if (senha.atual !== client.password) {
      toast("Senha atual incorreta.", "error");
      return;
    }
    if (senha.nova.length < 6) {
      toast("A nova senha deve ter ao menos 6 caracteres.", "error");
      return;
    }
    if (senha.nova !== senha.confirma) {
      toast("A confirmação não corresponde à nova senha.", "error");
      return;
    }
    updateClient(client.id, { password: senha.nova });
    setSenha({ atual: "", nova: "", confirma: "" });
    toast("Senha alterada com sucesso.", "success");
  };

  const salvarPrefs = () => {
    toast("Preferências de notificação salvas.", "success");
  };

  return (
    <>
      <PageHead
        title="Perfil"
        subtitle="Gerencie os dados da sua empresa, conta e preferências."
      />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.key
                ? "border-gold-400 text-navy-900"
                : "border-transparent text-muted hover:text-navy-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Empresa */}
      {tab === "empresa" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Razão social">
                <Input
                  value={empresa.razaoSocial}
                  onChange={(e) => setE("razaoSocial", e.target.value)}
                />
              </Field>
              <Field label="Nome fantasia">
                <Input
                  value={empresa.nomeFantasia}
                  onChange={(e) => setE("nomeFantasia", e.target.value)}
                />
              </Field>
              <Field label="CNPJ">
                <Input
                  value={empresa.cnpj}
                  onChange={(e) => setE("cnpj", maskCNPJ(e.target.value))}
                />
              </Field>
              <Field label="Telefone">
                <Input
                  value={empresa.telefone}
                  onChange={(e) => setE("telefone", maskPhone(e.target.value))}
                />
              </Field>
              <Field label="Site">
                <Input
                  value={empresa.site}
                  onChange={(e) => setE("site", e.target.value)}
                />
              </Field>
              <Field label="Segmento">
                <Input
                  value={empresa.segmento}
                  onChange={(e) => setE("segmento", e.target.value)}
                />
              </Field>
              <Field label="Faturamento mensal (R$)" hint={BRL(Number(empresa.faturamentoMensal) || 0)}>
                <Input
                  type="number"
                  min={0}
                  value={empresa.faturamentoMensal}
                  onChange={(e) => setE("faturamentoMensal", e.target.value)}
                />
              </Field>
              <Field label="Volume de recebíveis (R$)" hint={BRL(Number(empresa.volumeRecebiveis) || 0)}>
                <Input
                  type="number"
                  min={0}
                  value={empresa.volumeRecebiveis}
                  onChange={(e) => setE("volumeRecebiveis", e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Endereço">
                  <Input
                    value={empresa.endereco}
                    onChange={(e) => setE("endereco", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Cidade">
                <Input
                  value={empresa.cidade}
                  onChange={(e) => setE("cidade", e.target.value)}
                />
              </Field>
              <Field label="Estado (UF)">
                <Input
                  maxLength={2}
                  value={empresa.estado}
                  onChange={(e) => setE("estado", e.target.value.toUpperCase())}
                />
              </Field>
              <Field label="CEP">
                <Input
                  value={empresa.cep}
                  onChange={(e) => setE("cep", e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-5 flex justify-end">
              <Button variant="gold" onClick={salvarEmpresa}>
                Salvar dados da empresa
              </Button>
            </div>
          </Card>

          {/* Sócios (read-only) */}
          <Card className="p-6">
            <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">
              Sócios / quadro societário
            </h2>
            {client.socios.length === 0 ? (
              <p className="text-sm text-muted">Nenhum sócio cadastrado.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {client.socios.map((s, i) => (
                  <div
                    key={`${s.cpf}-${i}`}
                    className="rounded-xl border border-line p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-navy-900">{s.nome}</p>
                      <Badge tone="gold">{pct(s.percentual)}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">CPF {maskCPF(s.cpf)}</p>
                    <p className="text-xs text-muted">{s.email}</p>
                    <p className="text-xs text-muted">{s.telefone}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-muted">
              Para alterar o quadro societário, abra uma solicitação em Atendimento.
            </p>
          </Card>
        </div>
      )}

      {/* Bancários */}
      {tab === "bancarios" && (
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Banco">
                <Input
                  value={banco.banco}
                  onChange={(e) => setB("banco", e.target.value)}
                  placeholder="Ex.: Banco do Brasil (001)"
                />
              </Field>
            </div>
            <Field label="Agência">
              <Input
                value={banco.agencia}
                onChange={(e) => setB("agencia", e.target.value)}
              />
            </Field>
            <Field label="Conta">
              <Input
                value={banco.conta}
                onChange={(e) => setB("conta", e.target.value)}
              />
            </Field>
            <Field label="Chave PIX">
              <Input
                value={banco.pix}
                onChange={(e) => setB("pix", e.target.value)}
              />
            </Field>
            <Field label="Titularidade">
              <Input
                value={banco.titularidade}
                onChange={(e) => setB("titularidade", e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="gold" onClick={salvarBanco}>
              Salvar dados bancários
            </Button>
          </div>
          <div className="mt-5">
            <Disclaimer>
              A conta de liberação deve ser de titularidade da empresa cadastrada.
              Alterações podem passar por validação de prevenção à fraude antes da
              próxima operação.
            </Disclaimer>
          </div>
        </Card>
      )}

      {/* Notificações */}
      {tab === "notificacoes" && (
        <Card className="p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">
            Preferências de notificação
          </h2>
          <div className="space-y-1">
            {(
              [
                ["propostas", "Atualizações de propostas e análises"],
                ["operacoes", "Liberações, vencimentos e liquidações"],
                ["documentos", "Pendências e validação de documentos"],
                ["marketing", "Novidades e comunicações da New Capital"],
              ] as [keyof typeof prefs, string][]
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-navy-900/5"
              >
                <span className="text-sm font-medium text-navy-900">{label}</span>
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, [key]: e.target.checked }))
                  }
                  className="h-5 w-5 rounded border-line text-navy-900 accent-navy-900"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="gold" onClick={salvarPrefs}>
              Salvar preferências
            </Button>
          </div>
        </Card>
      )}

      {/* Segurança */}
      {tab === "seguranca" && (
        <Card className="p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-navy-900">
            Alterar senha
          </h2>
          <div className="grid max-w-md gap-4">
            <Field label="Senha atual" required>
              <Input
                type="password"
                value={senha.atual}
                onChange={(e) => setSenha((s) => ({ ...s, atual: e.target.value }))}
              />
            </Field>
            <Field label="Nova senha" hint="Mínimo de 6 caracteres" required>
              <Input
                type="password"
                value={senha.nova}
                onChange={(e) => setSenha((s) => ({ ...s, nova: e.target.value }))}
              />
            </Field>
            <Field label="Confirmar nova senha" required>
              <Input
                type="password"
                value={senha.confirma}
                onChange={(e) =>
                  setSenha((s) => ({ ...s, confirma: e.target.value }))
                }
              />
            </Field>
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="gold" onClick={salvarSenha}>
              Alterar senha
            </Button>
          </div>
          <div className="mt-5">
            <Disclaimer>
              Ambiente demonstrativo. Não utilize senhas reais — os dados ficam
              armazenados apenas localmente no seu navegador.
            </Disclaimer>
          </div>
        </Card>
      )}
    </>
  );
}
