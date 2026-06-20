import { PageHero } from "@/components/site/Pieces";
import { Card, Disclaimer, SectionTitle } from "@/components/ui";

const checklist = [
  "KYC — Conheça seu Cliente", "KYB — Conheça sua Empresa", "Consulta de CNPJ",
  "Documentos societários", "Documentos dos sócios", "Verificação de PEP",
  "Listas de sanções", "Mídia negativa", "Comunicação ao COAF quando aplicável",
  "Política de PLD/FT", "Conformidade com a LGPD", "Validação de sacado",
  "Prevenção à fraude", "Comprovante de entrega", "Confirmação do título",
];

const selos = [
  ["Ambiente seguro", "Infraestrutura e práticas voltadas à proteção de dados."],
  ["Dados protegidos", "Tratamento conforme finalidade legítima e LGPD."],
  ["Análise contra fraude", "Verificações documentais e de duplicidade."],
  ["Operações sujeitas à aprovação", "Sem promessa de aprovação automática."],
  ["Contratos claros", "Cessão de crédito e condições transparentes."],
  ["Custos transparentes", "Deságio, tarifa e custo total demonstrados."],
];

export default function Compliance() {
  return (
    <>
      <PageHero
        eyebrow="Compliance & PLD/FT"
        title={<>Segurança jurídica e <span className="gold-text">conformidade</span> em cada operação.</>}
        subtitle="Operamos com políticas de prevenção à lavagem de dinheiro, conformidade com a LGPD e rigorosos controles de prevenção à fraude."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionTitle eyebrow="Checklist" title="O que verificamos" subtitle="Cada cliente e cada operação passam por verificações de compliance antes da liberação." />
            <Card className="mt-6 p-6">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {checklist.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-navy-900">
                    <span className="mt-0.5 text-emerald-500">✓</span> {c}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <div>
            <SectionTitle eyebrow="Garantias" title="Selos de confiança" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {selos.map(([t, d]) => (
                <Card key={t} className="hover-lift p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 text-gold-300">⛨</span>
                  <h3 className="mt-3 font-semibold text-navy-900">{t}</h3>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Disclaimer>
            As políticas de compliance, PLD/FT e LGPD são aplicadas conforme a
            legislação vigente e os procedimentos internos da New Capital. A
            aprovação de qualquer operação está condicionada ao resultado dessas
            verificações.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
