import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-gradient px-4 text-center text-white">
      <Logo light href="/" />
      <p className="mt-10 font-serif text-7xl font-semibold text-gold-300">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold">Página não encontrada</h1>
      <p className="mt-2 max-w-md text-white/65">
        O endereço que você procura não existe ou foi movido. Vamos te levar de
        volta a um caminho com mais liquidez.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 px-5 py-2.5 text-sm font-semibold text-navy-950">
          Voltar à Home
        </Link>
        <Link href="/app/dashboard" className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15">
          Ir para o portal
        </Link>
      </div>
    </div>
  );
}
