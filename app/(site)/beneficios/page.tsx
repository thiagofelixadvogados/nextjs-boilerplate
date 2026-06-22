import { PageHero } from "@/components/site/Pieces";
import { Button, Card, SectionTitle } from "@/components/ui";

const beneficios = [
  ["Capital imediato", "Receba à vista o valor de vendas a prazo."],
  ["Melhora do fluxo de caixa", "Equilibre entradas e saídas com previsibilidade."],
  ["Poder de negociação", "Compre melhor de fornecedores pagando à vista."],
  ["Menos dependência de bancos", "Diversifique suas fontes de capital de giro."],
  ["Análise de crédito do sacado", "Avaliamos quem deve pagar para você decidir com segurança."],
  ["Redução de inadimplência", "Critérios de risco e prevenção à fraude."],
  ["Cobrança profissional", "Gestão de recebimento, notificação e acompanhamento."],
  ["Gestão financeira terceirizada", "Trustee de contas a receber e a pagar."],
  ["Relatórios e indicadores", "Visão clara da sua carteira em tempo real."],
  ["Atendimento humano", "Especialistas dedicados ao seu negócio."],
  ["Taxas transparentes", "Deságio, tarifa e custo total demonstrados."],
  ["Operações estruturadas", "Capacidade para tickets maiores via securitizadora."],
];

export default function Beneficios() {
  return (
    <>
      <PageHero
        eyebrow="Benefícios para PMEs"
        title={<>Mais caixa, menos burocracia, <span className="gold-text">mais controle.</span></>}
        subtitle="Capital de giro para empresas que vendem hoje e precisam crescer agora."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map(([t, d]) => (
            <Card key={t} className="hover-lift flex gap-4 p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">✓</span>
              <div>
                <h3 className="font-semibold text-navy-900">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl bg-navy-gradient px-8 py-12 text-center text-white sm:px-16">
          <SectionTitle center light title="Pronto para fortalecer seu fluxo de caixa?" subtitle={<span className="text-white/70">Simule uma operação com dados simulados ou fale com um especialista.</span>} />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/app/simular" variant="gold" size="lg">Simular operação</Button>
            <Button href="/contato" size="lg" className="border border-white/20 bg-white/10 text-white hover:bg-white/15">Falar com especialista</Button>
          </div>
        </div>
      </section>
    </>
  );
}
