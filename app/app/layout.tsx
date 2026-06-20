import { PortalShell, type NavItem } from "@/components/portal/Shell";

const nav: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/app/simular", label: "Simular operação", icon: "✦" },
  { href: "/app/titulos", label: "Enviar títulos", icon: "↥" },
  { href: "/app/propostas", label: "Minhas propostas", icon: "▤" },
  { href: "/app/operacoes", label: "Operações", icon: "◷" },
  { href: "/app/documentos", label: "Documentos", icon: "▢" },
  { href: "/app/sacados", label: "Sacados", icon: "◎" },
  { href: "/app/relatorios", label: "Relatórios", icon: "▥" },
  { href: "/app/atendimento", label: "Atendimento", icon: "☎" },
  { href: "/app/perfil", label: "Perfil", icon: "♚" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell role="client" nav={nav}>
      {children}
    </PortalShell>
  );
}
