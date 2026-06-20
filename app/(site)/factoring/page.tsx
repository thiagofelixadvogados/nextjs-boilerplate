import { PageHero, FAQ } from "@/components/site/Pieces";
import { Card, Button, Disclaimer, SectionTitle } from "@/components/ui";

const faq = [
  { q: "Factoring é empréstimo?", a: "Não. Factoring é fomento mercantil — a aquisição de direitos creditórios. A empresa vende seus recebíveis e recebe à vista mediante deságio. Não há contratação de dívida bancária nem captação de recursos." },
  { q: "O que é deságio?", a: "É o desconto aplicado sobre o valor de face do título para remunerar a antecipação ao longo do prazo até o vencimento. Quanto maior o prazo e o risco do sacado, maior tende a ser o deságio." },
  { q: "O que é sacado?", a: "É o devedor do título — a empresa ou pessoa que deve pagar a duplicata, nota fiscal ou cheque na data de vencimento. A análise de crédito recai principalmente sobre o sacado." },
  { q: "Quais títulos posso antecipar?", a: "Duplicatas, notas fiscais, cheques, promissórias, contratos e recebíveis de cartão, sempre sujeitos à validação documental e análise de crédito." },
  { q: "A aprovação é garantida?", a: "Não. Toda operação está sujeita à análise cadastral, documental, de crédito do sacado, prevenção à fraude e às políticas internas e de PLD/FT da New Capital." },
];

export default function FactoringPage() {
  return (
    <>
      <PageHero
        eyebrow="O que é Factoring"
        title={<>Transformamos vendas a prazo em <span className="gold-text">liquidez imediata.</span></>}
        subtitle="Factoring é uma operação de fomento mercantil baseada na aquisição de direitos creditórios. Sua empresa vende recebíveis e recebe à vista, mediante deságio."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 text-base leading-relaxed text-ink/80">
            <p>
              No factoring, a empresa fomentada vende seus créditos — gerados por
              vendas a prazo — para a empresa de fomento mercantil. Em troca,
              recebe imediatamente o valor desses recebíveis futuros, mediante um
              deságio que remunera a antecipação.
            </p>
            <p>
              Isso permite que pequenas e médias empresas transformem duplicatas,
              notas fiscais, cheques, promissórias ou recebíveis de cartão em
              <strong> caixa imediato</strong>, ganhando poder de negociação com
              fornecedores e evitando a descapitalização.
            </p>
            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="font-semibold text-navy-900">Factoring NÃO é:</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li className="flex gap-2"><span className="text-red-500">✕</span> Empréstimo</li>
                <li className="flex gap-2"><span className="text-red-500">✕</span> Financiamento bancário</li>
                <li className="flex gap-2"><span className="text-red-500">✕</span> Dívida bancária tradicional</li>
                <li className="flex gap-2"><span className="text-red-500">✕</span> Captação de recursos junto ao público / investimento</li>
              </ul>
            </div>
          </div>

          <Card className="h-fit p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Glossário rápido</p>
            <dl className="mt-4 space-y-4 text-sm">
              {[
                ["Cessão de crédito", "Transferência formal do direito de receber o título para a factoring."],
                ["Direitos creditórios", "Os recebíveis que a empresa tem a receber de seus clientes."],
                ["Antecipação", "Receber hoje o valor de uma venda a prazo, com deságio."],
                ["Cobrança", "Gestão profissional do recebimento junto ao sacado."],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="font-semibold text-navy-900">{t}</dt>
                  <dd className="text-muted">{d}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </section>

      {/* Comparativo */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionTitle center eyebrow="Comparativo" title="Factoring x Banco" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            <Card className="border-gold-300/50 p-7">
              <h3 className="font-serif text-xl font-semibold text-navy-900">Factoring</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-navy-900">
                {["Venda de recebíveis", "Análise do sacado", "Agilidade", "Menos burocracia", "Capital de giro rápido", "Cobrança profissional"].map((x) => (
                  <li key={x} className="flex gap-2"><span className="text-emerald-500">✓</span>{x}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-7">
              <h3 className="font-serif text-xl font-semibold text-muted">Banco</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {["Empréstimo", "Dívida", "Garantias", "Burocracia", "Limite de crédito", "Análise bancária tradicional"].map((x) => (
                  <li key={x} className="flex gap-2"><span className="text-muted/50">—</span>{x}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <SectionTitle center eyebrow="Dúvidas frequentes" title="Perguntas sobre factoring" />
        <div className="mt-8"><FAQ items={faq} /></div>
        <div className="mt-8"><Disclaimer>Conteúdo informativo. As operações dependem de análise e aprovação interna. Não há promessa de aprovação ou de condições específicas.</Disclaimer></div>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/como-funciona" variant="primary">Como funciona</Button>
          <Button href="/cadastro" variant="gold">Criar cadastro</Button>
        </div>
      </section>
    </>
  );
}
