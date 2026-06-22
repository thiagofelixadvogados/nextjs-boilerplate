import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Toaster } from "@/components/Toaster";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-gradient p-12 text-white lg:flex">
        <Logo light href="/" />
        <div>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-balance">
            Antecipação de recebíveis com{" "}
            <span className="gold-text">transparência, tecnologia e segurança jurídica.</span>
          </h2>
          <p className="mt-5 max-w-md text-white/70">
            Acesse o portal para simular operações, enviar títulos e acompanhar
            suas propostas em tempo real.
          </p>
          <ul className="mt-8 space-y-3">
            {["Análise de crédito do sacado", "Cobrança e gestão profissional", "Compliance, LGPD e PLD/FT"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-white/80">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-400/20 text-gold-300">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-white/40">
          Ambiente demonstrativo · dados simulados · localStorage
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-paper">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Logo href="/" />
          <Link href="/" className="text-sm text-muted hover:text-navy-900">← Início</Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
