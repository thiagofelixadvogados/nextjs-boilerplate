import { PageHero, Steps } from "@/components/site/Pieces";
import { Card, Button, Disclaimer, SectionTitle } from "@/components/ui";

const fluxo = [
  { t: "Cliente envia títulos", d: "Os recebíveis são enviados pelo portal para análise." },
  { t: "New Capital analisa", d: "Originação, análise de crédito do sacado e validação documental." },
  { t: "Carteira é estruturada", d: "Os recebíveis elegíveis são agrupados em uma carteira." },
  { t: "Securitizadora avalia", d: "A parceira analisa elegibilidade, risco e condições de mercado." },
  { t: "Captação ou estruturação", d: "A carteira pode ser convertida em instrumento de captação no mercado de capitais." },
  { t: "Cliente obtém melhores condições", d: "Escala e taxas mais competitivas para novas operações." },
  { t: "Relacionamento contínuo", d: "A New Capital mantém a originação e o relacionamento com o cliente." },
];

export default function Securitizadora() {
  return (
    <>
      <PageHero
        eyebrow="Parceria com Securitizadora"
        title={<>Escala e taxas competitivas com <span className="gold-text">estruturação de carteiras.</span></>}
        subtitle="A New Capital origina, analisa e estrutura carteiras de recebíveis. A parceira securitizadora pode transformá-las em instrumentos de captação junto ao mercado de capitais."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionTitle eyebrow="Como gera valor" title="Mais capacidade para atender sua empresa" subtitle="Ao estruturar carteiras com uma securitizadora, ampliamos a capacidade de originação, ganhamos escala e podemos oferecer condições mais competitivas." />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[["Escala", "Mais volume"], ["Taxas", "Mais competitivas"], ["Capacidade", "Alto ticket"]].map(([t, d]) => (
                <Card key={t} className="hover-lift p-5 text-center">
                  <p className="font-serif text-lg font-semibold text-navy-900">{t}</p>
                  <p className="text-xs text-muted">{d}</p>
                </Card>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contato" variant="gold">Falar com especialista</Button>
              <Button href="/estrutura" variant="outline">Conhecer a estrutura</Button>
            </div>
          </div>
          <Card className="p-7">
            <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Fluxo da estruturação</p>
            <div className="mt-6"><Steps steps={fluxo} /></div>
          </Card>
        </div>

        <div className="mt-12">
          <Disclaimer>
            A estrutura com securitizadora depende de aprovação, elegibilidade dos
            recebíveis, análise de risco, condições de mercado e conformidade
            regulatória. Não constitui oferta de valores mobiliários nem promessa
            de captação.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
