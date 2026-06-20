"use client";

import { useState } from "react";
import { PageHead } from "@/components/portal/Shell";
import { Card, Button, Disclaimer } from "@/components/ui";
import { useApp } from "@/lib/store";

function Toggle({
  label,
  hint,
  on,
  onToggle,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-navy-900">{label}</p>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 flex-none rounded-full transition ${on ? "bg-gold-500" : "bg-navy-900/15"}`}
        aria-pressed={on}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

export default function AdminConfiguracoes() {
  const { resetDemo } = useApp();

  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    atrasoAlerts: true,
    complianceStrict: true,
    darkSidebar: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleReset = () => {
    if (
      window.confirm(
        "Tem certeza? Isso restaura todos os dados de demonstração e descarta as alterações feitas no ambiente."
      )
    ) {
      resetDemo();
    }
  };

  return (
    <>
      <PageHead
        title="Configurações"
        subtitle="Preferências do ambiente administrativo e gestão de dados de demonstração."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Dados de demonstração</h2>
          <p className="mt-2 text-sm text-muted">
            Restaura clientes, propostas, operações, documentos e carteiras ao
            estado inicial. Útil para reiniciar uma apresentação.
          </p>
          <Button variant="danger" className="mt-4" onClick={handleReset}>
            Restaurar dados de demonstração
          </Button>
        </Card>

        <Card className="p-5">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Credenciais de acesso</h2>
          <p className="mt-2 text-sm text-muted">Credenciais administrativas (somente leitura).</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">E-mail</dt>
              <dd className="font-medium text-navy-900">admin@newcapital.com</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Senha</dt>
              <dd className="font-medium text-navy-900">admin123</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Preferências</h2>
          <div className="mt-2 divide-y divide-line">
            <Toggle
              label="Alertas por e-mail"
              hint="Notificar novas propostas e mudanças de status."
              on={prefs.emailAlerts}
              onToggle={() => toggle("emailAlerts")}
            />
            <Toggle
              label="Alertas de atraso"
              hint="Destacar operações com dias em atraso no painel."
              on={prefs.atrasoAlerts}
              onToggle={() => toggle("atrasoAlerts")}
            />
            <Toggle
              label="Compliance restrito"
              hint="Exigir checklist completo antes de liberar operações."
              on={prefs.complianceStrict}
              onToggle={() => toggle("complianceStrict")}
            />
            <Toggle
              label="Sidebar escura"
              hint="Manter o menu lateral em tema navy."
              on={prefs.darkSidebar}
              onToggle={() => toggle("darkSidebar")}
            />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Disclaimer>
          Ambiente totalmente simulado e client-side. Os dados são armazenados
          apenas no seu navegador (localStorage) e as preferências acima são
          ilustrativas, sem efeito sobre sistemas externos. Nenhuma informação
          real é coletada ou transmitida.
        </Disclaimer>
      </div>
    </>
  );
}
