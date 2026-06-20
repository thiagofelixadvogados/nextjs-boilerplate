import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  // Premium "FP" monogram with an upward-flow accent — financial-institution feel.
  // No scales of justice, no law-office vibe.
  return (
    <svg viewBox="0 0 44 44" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="fp-gold" x1="6" y1="6" x2="38" y2="38">
          <stop offset="0" stopColor="#e7cd8a" />
          <stop offset="0.5" stopColor="#d9b35c" />
          <stop offset="1" stopColor="#b88a2b" />
        </linearGradient>
        <linearGradient id="fp-navy" x1="0" y1="0" x2="44" y2="44">
          <stop offset="0" stopColor="#122451" />
          <stop offset="1" stopColor="#0a1124" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill="url(#fp-navy)" />
      {/* fine gold inset border */}
      <rect x="3.5" y="3.5" width="37" height="37" rx="9.5" stroke="url(#fp-gold)" strokeOpacity="0.45" strokeWidth="1" />
      {/* serif FP monogram */}
      <text
        x="22"
        y="30.5"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="22"
        fontWeight="600"
        letterSpacing="-1"
        fill="url(#fp-gold)"
      >
        FP
      </text>
      {/* upward-flow accent underline */}
      <path
        d="M12 34.5c5 0 7-2.4 10-2.4s5 2.4 10 2.4"
        stroke="url(#fp-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
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
