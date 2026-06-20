import { LegalPage } from "@/components/site/LegalPage";

export default function Termos() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Termos de Uso"
      updated="20 de junho de 2026"
      sections={[
        {
          h: "Natureza das operações",
          p: [
            "A Fluxo Prime Fomento S/A atua com fomento mercantil (factoring), realizando a aquisição de direitos creditórios mediante deságio. As operações não constituem empréstimo, financiamento bancário, investimento ou captação de recursos junto ao público.",
          ],
        },
        {
          h: "Análise e aprovação",
          p: [
            "Toda operação está sujeita à análise cadastral, análise de crédito do sacado, validação documental, prevenção à fraude e às políticas internas de PLD/FT e LGPD. Não há promessa ou garantia de aprovação, nem de condições específicas.",
            "As simulações disponibilizadas na plataforma são meramente indicativas e não representam oferta vinculante.",
          ],
        },
        {
          h: "Responsabilidades do usuário",
          p: [
            "O usuário se compromete a fornecer informações verídicas e documentos legítimos, respondendo pela autenticidade dos títulos cedidos e pela inexistência de duplicidade ou vícios.",
          ],
        },
        {
          h: "Plataforma demonstrativa",
          p: [
            "Este ambiente é um protótipo funcional com dados simulados e persistência local (localStorage). Não realiza operações financeiras reais, não movimenta recursos e não deve ser utilizado com dados pessoais ou empresariais reais.",
          ],
        },
        {
          h: "Alterações",
          p: ["Estes termos podem ser atualizados a qualquer momento, conforme a evolução dos serviços e da legislação aplicável."],
        },
      ]}
    />
  );
}
