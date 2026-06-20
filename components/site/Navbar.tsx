"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui";
import { useApp } from "@/lib/store";

const links = [
  { href: "/factoring", label: "O que é Factoring" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/beneficios", label: "Benefícios" },
  { href: "/estrutura", label: "Estrutura" },
  { href: "/securitizadora", label: "Securitizadora" },
  { href: "/contato", label: "Contato" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { state } = useApp();
  const logged = !!state.currentUser;
  const dashHref = state.currentUser?.role === "admin" ? "/admin" : "/app/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === l.href
                  ? "text-navy-900"
                  : "text-muted hover:text-navy-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {logged ? (
            <Button href={dashHref} variant="gold" size="sm">
              Minha área
            </Button>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Entrar
              </Button>
              <Button href="/cadastro" variant="gold" size="sm">
                Criar cadastro
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-lg text-navy-900 lg:hidden"
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-900 hover:bg-navy-900/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {logged ? (
                <Button href={dashHref} variant="gold" size="sm" className="flex-1">
                  Minha área
                </Button>
              ) : (
                <>
                  <Button href="/login" variant="outline" size="sm" className="flex-1">
                    Entrar
                  </Button>
                  <Button href="/cadastro" variant="gold" size="sm" className="flex-1">
                    Cadastro
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
