import { PortalShell, type NavItem } from "@/components/portal/Shell";

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/clientes", label: "Clientes", icon: "♚" },
  { href: "/admin/analises", label: "Análises", icon: "✦" },
  { href: "/admin/propostas", label: "Propostas", icon: "▤" },
  { href: "/admin/operacoes", label: "Operações", icon: "◷" },
  { href: "/admin/documentos", label: "Documentos", icon: "▢" },
  { href: "/admin/sacados", label: "Sacados", icon: "◎" },
  { href: "/admin/compliance", label: "Compliance", icon: "✓" },
  { href: "/admin/securitizadora", label: "Securitizadora", icon: "◆" },
  { href: "/admin/relatorios", label: "Relatórios", icon: "▥" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell role="admin" nav={nav}>
      {children}
    </PortalShell>
  );
}
