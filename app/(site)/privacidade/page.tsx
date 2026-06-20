import { LegalPage } from "@/components/site/LegalPage";

export default function Privacidade() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de Privacidade"
      updated="20 de junho de 2026"
      sections={[
        {
          h: "Coleta e finalidade dos dados",
          p: [
            "A Fluxo Prime Fomento S/A coleta e trata dados pessoais e empresariais para finalidades legítimas relacionadas ao fomento mercantil: cadastro, análise de crédito, prevenção à fraude, formalização de operações de aquisição de direitos creditórios, cumprimento de obrigações legais e regulatórias e comunicação com o cliente.",
            "O tratamento observa a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) e os princípios da finalidade, adequação, necessidade e segurança.",
          ],
        },
        {
          h: "Compartilhamento de dados",
          p: [
            "Os dados podem ser compartilhados, dentro da finalidade legítima e quando necessário à operação, com parceiros operacionais, securitizadora, bureaus de crédito, instituições financeiras, assessorias jurídicas e contábeis e sistemas de cobrança.",
            "O compartilhamento ocorre sempre de forma proporcional e segura, limitado ao necessário para a execução das operações e o cumprimento de obrigações legais.",
          ],
        },
        {
          h: "Direitos do titular",
          p: [
            "O titular pode solicitar acesso, correção, portabilidade, anonimização ou eliminação de dados, bem como informações sobre o tratamento, observadas as obrigações legais de guarda de informações.",
          ],
        },
        {
          h: "Segurança",
          p: [
            "Adotamos medidas técnicas e organizacionais para proteger os dados contra acesso não autorizado, perda ou alteração indevida. Este é um projeto demonstrativo e não deve receber dados pessoais reais.",
          ],
        },
        {
          h: "Contato",
          p: ["Dúvidas sobre privacidade podem ser encaminhadas para privacidade@fluxoprime.com."],
        },
      ]}
    />
  );
}
