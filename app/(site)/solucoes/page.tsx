import { PageHero } from "@/components/site/Pieces";
import { Card, Button, Badge, Disclaimer } from "@/components/ui";

const solucoes = [
  { t: "Convencional", icon: "▣", d: "Aquisição de duplicatas, notas fiscais, promissórias e cheques com pagamento à vista mediante deságio.", tag: "Mais comum" },
  { t: "Sem Recurso", icon: "⛨", d: "A factoring assume o risco de inadimplência do sacado, mediante análise rigorosa e taxa premium.", tag: "Risco assumido" },
  { t: "Com Recurso", icon: "⇄", d: "Operação com direito de regresso contra o cedente em caso de inadimplência do sacado, com custo menor.", tag: "Custo menor" },
  { t: "Trustee", icon: "▤", d: "Gestão completa de contas a receber, contas a pagar, cobrança, relatórios e dashboard para empresas.", tag: "Gestão total" },
  { t: "Maturity", icon: "◷", d: "Gestão de cobrança com pagamento programado na data combinada, sem antecipação imediata.", tag: "Programado" },
  { t: "Recebíveis de Cartão", icon: "▦", d: "Antecipação ou estruturação de valores decorrentes de vendas em cartão ou maquininhas.", tag: "Cartão" },
  { t: "Exportação", icon: "✈", d: "Solução futura para recebíveis internacionais, com análise específica de risco, câmbio e documentação.", tag: "Em breve" },
];

export default function Solucoes() {
  return (
    <>
      <PageHero
        eyebrow="O que Atuamos"
        title={<>Modalidades para cada <span className="gold-text">necessidade de caixa.</span></>}
        subtitle="Da antecipação convencional à gestão completa da carteira, estruturamos a operação certa para o seu momento."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solucoes.map((s) => (
            <Card key={s.t} className="flex flex-col p-6 transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-900 text-xl text-gold-300">{s.icon}</span>
                <Badge tone="gold">{s.tag}</Badge>
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold text-navy-900">{s.t}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.d}</p>
              <Button href="/app/simular" variant="ghost" size="sm" className="mt-4 self-start px-0 hover:bg-transparent text-gold-600">
                Simular esta modalidade →
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Disclaimer>
            A disponibilidade de cada modalidade, especialmente operações sem
            recurso e de exportação, depende de análise de risco, elegibilidade do
            recebível, perfil do sacado e políticas internas da Fluxo Prime.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
