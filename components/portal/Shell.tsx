"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Toaster } from "@/components/Toaster";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export function PortalShell({
  role,
  nav,
  children,
}: {
  role: Role;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const { state, logout, ready } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user = state.currentUser;
  const authorized = ready && user && user.role === role;

  // redirect if not authorized (after hydration)
  useEffect(() => {
    if (ready && (!user || user.role !== role)) {
      router.replace("/login");
    }
  }, [ready, user, role, router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-muted">
        Carregando…
      </div>
    );
  }
  if (!authorized) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-muted">
        Redirecionando para o login…
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const accent = role === "admin" ? "Administração" : "Área do Cliente";

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo light href={role === "admin" ? "/admin" : "/app/dashboard"} />
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300/80">
          {accent}
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-3 py-3">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white">
          <span className="w-5 text-center">↗</span> Voltar ao site
        </Link>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white">
          <span className="w-5 text-center">⎋</span> Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-navy-gradient lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-navy-gradient">{SidebarContent}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg text-navy-900 lg:hidden" aria-label="Menu">
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </div>
            </button>
            <p className="text-sm text-muted">
              <span className="hidden sm:inline">{accent} · </span>
              <span className="font-semibold text-navy-900">{user.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline ${role === "admin" ? "bg-gold-300/30 text-gold-600" : "bg-emerald-50 text-emerald-700"}`}>
              {role === "admin" ? "Admin" : "Cliente"}
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-sm font-bold text-gold-300">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}

export function PageHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-navy-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
