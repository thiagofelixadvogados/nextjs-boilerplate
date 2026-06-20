import Link from "next/link";
import { Button, Card, SectionTitle, Disclaimer } from "@/components/ui";
import { LogoMark } from "@/components/Logo";

const diferenciais = [
  { t: "Capital robusto", d: "Capital integralizado de R$ 5 milhões para operações de alto ticket.", i: "▣" },
  { t: "Aprovação rápida", d: "Análise ágil de títulos e do sacado, com resposta objetiva.", i: "⚡" },
  { t: "Análise de crédito gratuita", d: "Avaliamos o sacado sem custo para você decidir com segurança.", i: "◎" },
  { t: "Cobrança terceirizada", d: "Gestão profissional de cobrança, notificação e acompanhamento.", i: "☎" },
  { t: "Gestão completa", d: "Dashboard, relatórios e indicadores de toda a sua carteira.", i: "▤" },
  { t: "Parceria com securitizadora", d: "Estruturação de carteiras para escala e taxas competitivas.", i: "⇄" },
  { t: "Compliance total", d: "KYC, KYB, PLD/FT, LGPD e prevenção à fraude em cada operação.", i: "✓" },
  { t: "Atendimento personalizado", d: "Especialistas dedicados à realidade da sua empresa.", i: "♚" },
];

const numeros = [
  { v: "R$ 5 mi", l: "Capital integralizado" },
  { v: "7", l: "Modalidades de operação" },
  { v: "100%", l: "Operações com compliance" },
  { v: "24h", l: "Análise ágil de títulos" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-gradient text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Factoring Premium • Fomento Mercantil • Recebíveis
            </span>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Capital de giro inteligente para empresas que{" "}
              <span className="gold-text">não podem esperar.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Antecipe recebíveis, fortaleça seu fluxo de caixa e profissionalize
              sua gestão financeira com uma factoring premium, transparente e
              orientada por compliance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/app/simular" variant="gold" size="lg">
                Simular operação
              </Button>
              <Button href="/cadastro" size="lg" className="bg-white/10 text-white hover:bg-white/15 border border-white/15">
                Criar cadastro
              </Button>
              <Button href="/contato" variant="ghost" size="lg" className="text-white hover:bg-white/10">
                Falar com especialista
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {numeros.map((n) => (
                <div key={n.l}>
                  <p className="font-serif text-2xl font-semibold text-gold-300">{n.v}</p>
                  <p className="text-xs text-white/55">{n.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating "operation" card */}
          <div className="animate-rise lg:justify-self-end">
            <div className="glass w-full max-w-sm rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <LogoMark className="h-10 w-10" />
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  Sujeito à análise
                </span>
              </div>
              <p className="mt-6 text-xs uppercase tracking-wide text-white/50">
                Antecipação estimada
              </p>
              <p className="mt-1 font-serif text-4xl font-semibold text-white">
                R$ 115.440
              </p>
              <div className="mt-5 space-y-2 text-sm">
                {[
                  ["Valor bruto do título", "R$ 120.000"],
                  ["Prazo", "45 dias"],
                  ["Deságio estimado", "R$ 4.320"],
                  ["Tarifa operacional", "R$ 240"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-white/70">
                    <span>{k}</span>
                    <span className="font-medium text-white">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 h-px bg-white/10" />
              <p className="mt-3 text-[11px] leading-relaxed text-white/45">
                Simulação meramente indicativa. Condições finais dependem de
                análise cadastral, documental e de crédito do sacado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle
          center
          eyebrow="Por que a New Capital"
          title="Uma estrutura completa para PMEs que precisam de velocidade, limite e confiança"
          subtitle="Mais caixa, menos burocracia, mais controle. Transformamos vendas a prazo em liquidez para a sua empresa."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {diferenciais.map((d) => (
            <Card key={d.t} className="hover-lift p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-900 text-lg text-gold-300">
                {d.i}
              </span>
              <h3 className="mt-4 font-semibold text-navy-900">{d.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FACTORING vs BANCO teaser */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="Fomento mercantil"
              title={<>Não é empréstimo. É <span className="gold-text">venda de recebíveis.</span></>}
              subtitle="Factoring é uma operação de aquisição de direitos creditórios. A sua empresa vende duplicatas, notas fiscais, cheques ou recebíveis de cartão e recebe à vista, mediante deságio — sem gerar dívida bancária tradicional."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/factoring" variant="primary">Entender o factoring</Button>
              <Button href="/como-funciona" variant="outline">Ver como funciona</Button>
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-line">
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Factoring</p>
                <ul className="mt-4 space-y-2.5 text-sm text-navy-900">
                  {["Venda de recebíveis", "Análise do sacado", "Agilidade", "Menos burocracia", "Capital de giro rápido", "Cobrança profissional"].map((x) => (
                    <li key={x} className="flex gap-2"><span className="text-emerald-500">✓</span>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-paper/50 p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Banco</p>
                <ul className="mt-4 space-y-2.5 text-sm text-muted">
                  {["Empréstimo", "Dívida", "Garantias", "Burocracia", "Limite de crédito", "Análise bancária tradicional"].map((x) => (
                    <li key={x} className="flex gap-2"><span className="text-muted/60">—</span>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-navy-gradient px-8 py-14 text-center text-white sm:px-16">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold sm:text-4xl text-balance">
            A factoring que tem tudo para transformar recebíveis em crescimento.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Análise rápida, contratos claros e gestão profissional da carteira.
            Comece em minutos com dados simulados.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/cadastro" variant="gold" size="lg">Criar cadastro</Button>
            <Button href="/app/simular" size="lg" className="border border-white/20 bg-white/10 text-white hover:bg-white/15">
              Simular agora
            </Button>
          </div>
          <p className="mt-6 text-xs text-white/45">
            Acesso de demonstração — cliente: <strong className="text-white/70">cliente@empresa.com</strong> / cliente123 ·
            admin: <strong className="text-white/70">admin@newcapital.com</strong> / admin123
          </p>
        </div>
        <div className="mt-8">
          <Disclaimer>
            As operações estão sujeitas à análise cadastral, análise de crédito do
            sacado, validação documental, prevenção à fraude, LGPD e políticas de
            PLD/FT. Não há promessa de aprovação. Factoring não é investimento nem
            captação junto ao público.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
