# New Capital Fomento Mercantil Ltda. — Plataforma de Factoring (protótipo funcional)

Aplicação web institucional **+ portal do cliente + área administrativa** para uma
factoring premium (fomento mercantil / antecipação de recebíveis), construída em
**Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4**.

> ⚠️ **Ambiente demonstrativo.** Todos os dados são simulados e persistidos no
> `localStorage` do navegador. Não há backend, não há movimentação financeira real
> e nenhum dado pessoal real deve ser inserido. Factoring **não é** empréstimo,
> financiamento bancário nem investimento.

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Build de produção: `npm run build && npm start`.

## Acessos de demonstração

| Perfil  | E-mail                  | Senha       |
| ------- | ----------------------- | ----------- |
| Cliente | `cliente@empresa.com`   | `cliente123`|
| Admin   | `admin@newcapital.com`  | `admin123`  |

Você também pode criar um novo cadastro de cliente em **/cadastro** (multi-etapas).

## O que tem na aplicação

**Site institucional (público)**
`/` Home · `/factoring` O que é Factoring · `/como-funciona` · `/solucoes` ·
`/beneficios` · `/estrutura` · `/securitizadora` · `/contato` · `/compliance` ·
`/privacidade` · `/termos` · página 404.

**Portal do cliente** (`/app/*`, requer login de cliente)
Dashboard · Simular operação · Enviar títulos · Minhas propostas · Operações ·
Documentos · Sacados · Relatórios · Atendimento · Perfil.

**Área administrativa** (`/admin/*`, requer login de admin)
Dashboard · Clientes · Análises · Propostas · Operações · Documentos · Sacados ·
Compliance (KYC/KYB/PLD-FT/LGPD) · Securitizadora (montagem de carteira) ·
Relatórios · Configurações.

## Arquitetura

```
app/
  (site)/        páginas públicas + layout (Navbar/Footer)
  (auth)/        login, cadastro, recuperar-senha + layout split-screen
  app/           portal do cliente (PortalShell role="client")
  admin/         área administrativa (PortalShell role="admin")
components/
  ui.tsx         design system (Button, Card, Badge, Modal, Table, Field, ...)
  Logo.tsx       marca textual + ícone abstrato de fluxo
  site/          Navbar, Footer, Pieces (FAQ, Steps, Hero), LegalPage
  portal/Shell   sidebar/topbar + guarda de autenticação
lib/
  types.ts       tipos de domínio
  format.ts      BRL/%, máscaras, rótulos/cores de status, simulateFactoring()
  mockData.ts    seed de demonstração
  store.tsx      AppProvider (Context + localStorage) + useApp()
```

## Estado da entrega

**Funcional (já funciona com dados simulados):** navegação completa; cadastro,
login e logout (cliente e admin) com persistência em `localStorage`; simulador de
factoring com cálculo demonstrativo de deságio, tarifa, valor líquido e CET; envio
de títulos gerando propostas; fluxo de status de propostas; aceite de proposta
gerando operação; cadastro/edição de sacados; central de documentos; relatórios
com gráficos em CSS; atendimento; edição de perfil; painel admin com mudança de
status, compliance checklist e montagem de carteira para securitizadora.

**Simulado / mock:** uploads (apenas o nome do arquivo é capturado), e-mails,
análise de crédito/bureaus, assinatura digital, cobrança e qualquer integração
externa. Cálculos financeiros são meramente indicativos.

**A integrar depois (backend real):** autenticação e autorização (JWT/OAuth),
banco de dados, upload seguro de arquivos, consulta de CNPJ/bureaus, assinatura
digital, motor de crédito/antifraude, cobrança e conciliação bancária.

**Sugestões de evolução:** Supabase ou PostgreSQL + Prisma como banco; Firebase
Auth/Supabase Auth; storage (S3/Supabase Storage); APIs de Serasa/CND/Receita,
assinatura (Clicksign/D4Sign), open finance e PIX; v2.0 com notificações,
multiusuário por empresa, trilha de auditoria e relatórios exportáveis.
