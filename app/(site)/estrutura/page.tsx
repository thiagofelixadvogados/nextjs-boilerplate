import { PageHero } from "@/components/site/Pieces";
import { Card, Button, Disclaimer, SectionTitle, StatCard } from "@/components/ui";
import { asset } from "@/lib/asset";

const pilares = [
  ["Estrutura robusta", "Capacidade e solidez para operações de alto ticket."],
  ["Tecnologia própria", "Plataforma de originação, análise e gestão de carteira."],
  ["Equipe especializada", "Crédito, jurídico, compliance e atendimento dedicados."],
  ["Governança", "Processos, alçadas e contratos claros em cada operação."],
  ["Compliance total", "KYC, KYB, PLD/FT, COAF e prevenção à fraude."],
  ["Segurança jurídica", "Cessão de crédito formalizada e contratos transparentes."],
  ["LGPD", "Tratamento de dados conforme a Lei Geral de Proteção de Dados."],
  ["Parceria com securitizadora", "Estruturação de carteiras para escala e melhores taxas."],
];

export default function Estrutura() {
  return (
    <>
      <PageHero
        eyebrow="Estrutura"
        title={<>Solidez, governança e <span className="gold-text">segurança jurídica.</span></>}
        subtitle="Uma estrutura completa de fomento mercantil, com capital robusto, tecnologia própria e compliance em cada operação."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Presença" value="MG · SP" hint="Matriz e filial" tone="gold" />
          <StatCard label="Modalidades" value="7" hint="de fomento mercantil" />
          <StatCard label="Compliance" value="100%" hint="das operações" tone="green" />
          <StatCard label="Alto ticket" value="Sim" hint="via securitizadora" />
        </div>

        {/* Institutional image + presença */}
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-line card-shadow">
            <img
              src={asset("/nc-office.jpg")}
              alt="Sinalização da sede da New Capital Fomento Mercantil"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <SectionTitle
              eyebrow="Quem somos"
              title={<>Uma casa de fomento construída sobre <span className="gold-text">confiança</span>.</>}
              subtitle="Estrutura profissional, presença em praças estratégicas e atendimento próximo do cliente — para transformar recebíveis em crescimento com segurança."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card className="hover-lift p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Matriz</p>
                <p className="mt-2 font-semibold text-navy-900">Guaxupé — MG</p>
                <p className="mt-1 text-sm text-muted">Rua Salesianos, 265 · CEP 37830-056</p>
                <p className="mt-1 text-sm text-muted">CNPJ 67.615.866/0001-88</p>
              </Card>
              <Card className="hover-lift p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Filial</p>
                <p className="mt-2 font-semibold text-navy-900">São Paulo — SP</p>
                <p className="mt-1 text-sm text-muted">Rua Clodomiro Amazonas, 1099 · CEP 04537-012</p>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pilares.map(([t, d]) => (
            <Card key={t} className="hover-lift p-5">
              <h3 className="font-semibold text-navy-900">{t}</h3>
              <p className="mt-1.5 text-sm text-muted">{d}</p>
            </Card>
          ))}
        </div>

        {/* ANFAC */}
        <div className="mt-14 grid gap-8 rounded-3xl border border-line bg-paper p-8 lg:grid-cols-[1.1fr_0.9fr] sm:p-10">
          <div>
            <SectionTitle
              eyebrow="Boas práticas do setor"
              title="Alinhados às melhores práticas do fomento mercantil"
              subtitle="Orientamos nossa atuação pelas referências e pelo código de ética que estruturam o mercado brasileiro de factoring, representado por entidades como a ANFAC — Associação Nacional de Fomento Comercial, fundada em 1982."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/compliance" variant="primary">Ver compliance</Button>
              <Button href="/securitizadora" variant="outline">Parceria com securitizadora</Button>
            </div>
          </div>
          <Card className="p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Referências do setor</p>
            <ul className="mt-4 space-y-3 text-sm text-navy-900">
              {[
                ["Código de ética e disciplina", "Conduta profissional e transparência nas operações."],
                ["Fator de referência (Fator ANFAC)", "Acompanhamento de parâmetros de custo do mercado."],
                ["Profissionalização do setor", "Padrões técnicos, jurídicos e operacionais."],
                ["Credibilidade", "Compromisso com as melhores práticas do fomento comercial."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="text-gold-500">◆</span>
                  <span><strong className="text-navy-900">{t}.</strong> <span className="text-muted">{d}</span></span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-10">
          <Disclaimer>
            As informações institucionais podem ser ajustadas conforme a
            documentação societária, regulatória e operacional da empresa.
            Referências a entidades de classe têm caráter informativo sobre boas
            práticas do setor e não implicam, por si só, vínculo associativo.
          </Disclaimer>
        </div>
      </section>
    </>
  );
}
