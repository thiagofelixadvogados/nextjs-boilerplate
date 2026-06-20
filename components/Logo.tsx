import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  // Abstract "flow / rising capital" mark — no scales of justice, no law-office vibe.
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="fp-gold" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stopColor="#e7cd8a" />
          <stop offset="1" stopColor="#c79a3c" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="#0d1b3a" />
      {/* upward flow streams */}
      <path
        d="M9 27c4 0 5-3 8-6.5S23 13 31 13"
        stroke="url(#fp-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M9 31c5.5 0 7-4 10.5-8S25 16 31 16"
        stroke="url(#fp-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* arrow tip */}
      <path
        d="M26 11.5h6v6"
        stroke="url(#fp-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  light = false,
  href = "/",
  compact = false,
}: {
  light?: boolean;
  href?: string | null;
  compact?: boolean;
}) {
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className="h-9 w-9 shrink-0" />
      {!compact && (
        <span className="leading-none">
          <span
            className={`block font-serif text-lg font-semibold tracking-tight ${
              light ? "text-white" : "text-navy-900"
            }`}
          >
            FLUXO <span className="gold-text">PRIME</span>
          </span>
          <span
            className={`block text-[10px] font-medium uppercase tracking-[0.32em] ${
              light ? "text-white/60" : "text-muted"
            }`}
          >
            Fomento S/A
          </span>
        </span>
      )}
    </span>
  );
  if (href === null) return content;
  return (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  );
}
