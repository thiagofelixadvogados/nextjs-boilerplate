import { PageHero, Steps } from "@/components/site/Pieces";
import { Button, Card, Disclaimer, SectionTitle } from "@/components/ui";

const steps = [
  { t: "1. Cadastro único", d: "O cliente envia dados da empresa, contrato social, CNPJ, faturamento, documentos dos sócios e informações operacionais." },
  { t: "2. Envio dos títulos", d: "Pelo app, o cliente envia duplicatas, notas fiscais, cheques, promissórias ou recebíveis de cartão para análise." },
  { t: "3. Análise de crédito", d: "A New Capital analisa o sacado, o título, o risco de crédito, a validade documental, duplicidade, fraude e histórico." },
  { t: "4. Aprovação rápida", d: "O cliente recebe proposta com valores, deságio, taxa, prazo, custo total e valor líquido estimado." },
  { t: "5. Liberação", d: "Após o aceite e a formalização da cessão de crédito, o valor é liberado na conta cadastrada." },
  { t: "6. Cobrança e gestão", d: "A New Capital cuida da cobrança, acompanhamento, notificação e relatórios da carteira." },
];

export default function ComoFunciona() {
  return (
    <>
      <PageHero
        eyebrow="Como Funciona"
        title={<>Do cadastro à liberação em <span className="gold-text">6 etapas claras.</span></>}
        subtitle="Um fluxo operacional transparente, do envio do título à cobrança — com análise de crédito do sacado e contratos claros."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle eyebrow="Fluxo operacional" title="Simples, rápido e seguro" subtitle="Cada etapa é acompanhada pela linha do tempo da operação no seu portal." />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/app/simular" variant="gold">Simular operação</Button>
              <Button href="/cadastro" variant="outline">Começar cadastro</Button>
            </div>
            <Card className="mt-8 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-gold-600">O que você acompanha no portal</p>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-navy-900">
                {["Status do título", "Deságio e taxa", "Valor líquido", "Documentos", "Linha do tempo", "Liquidações"].map((x) => (
                  <li key={x} className="flex gap-2"><span className="text-emerald-500">✓</span>{x}</li>
                ))}
              </ul>
            </Card>
          </div>
          <div className="pt-2">
            <Steps steps={steps} />
          </div>
        </div>

        <div className="mt-12">
          <Disclaimer>
            Os prazos de análise são estimativos e podem variar conforme a
            completude documental, o porte da operação e a complexidade da análise
            de crédito do sacado. A aprovação não é garantida.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
