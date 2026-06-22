import Link from "next/link";
import { Logo } from "@/components/Logo";

const cols = [
  {
    title: "Soluções",
    links: [
      { href: "/solucoes", label: "Factoring Convencional" },
      { href: "/solucoes", label: "Com e Sem Recurso" },
      { href: "/solucoes", label: "Trustee / Maturity" },
      { href: "/solucoes", label: "Recebíveis de Cartão" },
      { href: "/securitizadora", label: "Parceria com Securitizadora" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/factoring", label: "O que é Factoring" },
      { href: "/como-funciona", label: "Como Funciona" },
      { href: "/estrutura", label: "Estrutura" },
      { href: "/beneficios", label: "Benefícios para PMEs" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Área do Cliente",
    links: [
      { href: "/login", label: "Entrar" },
      { href: "/cadastro", label: "Criar cadastro" },
      { href: "/app/simular", label: "Simular operação" },
      { href: "/app/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Legal & Compliance",
    links: [
      { href: "/privacidade", label: "Política de Privacidade" },
      { href: "/termos", label: "Termos de Uso" },
      { href: "/compliance", label: "Compliance & PLD/FT" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              Factoring premium, capital de giro e antecipação de recebíveis com
              transparência, tecnologia própria e segurança jurídica.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Capital de Giro", "Trustee", "Compliance", "LGPD", "PLD/FT"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-gold-300">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/65 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-white/50">
            <strong className="text-white/70">New Capital Fomento Mercantil Ltda.</strong> —
            CNPJ 67.615.866/0001-88 (Matriz) — Fomento Mercantil. As
            operações de aquisição de direitos creditórios estão sujeitas à
            análise cadastral, análise de crédito do sacado, validação
            documental, prevenção à fraude e às políticas de PLD/FT e LGPD.
            Factoring não é empréstimo nem financiamento bancário e não constitui
            captação de recursos junto ao público. Conteúdo meramente
            informativo e demonstrativo.
          </p>
          <p className="mt-4 text-xs text-white/50">
            <strong className="text-white/70">Matriz:</strong> Rua Salesianos, 265 — Guaxupé/MG — CEP 37830-056 — CNPJ 67.615.866/0001-88
            &nbsp;·&nbsp;
            <strong className="text-white/70">Filial:</strong> Rua Clodomiro Amazonas, 1099 — São Paulo/SP — CEP 04537-012
          </p>
          <p className="mt-2 text-xs text-white/40">
            © {new Date().getFullYear()} New Capital Fomento Mercantil Ltda. Todos os
            direitos reservados. Projeto demonstrativo.
          </p>
        </div>
      </div>
    </footer>
  );
}
