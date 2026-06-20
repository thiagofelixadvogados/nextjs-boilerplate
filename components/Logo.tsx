import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  // Interlocking "NC" monogram — New Capital. Gold on navy, premium financial feel.
  const navy = "#0d1b3a";
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="nc-gold" x1="8" y1="8" x2="40" y2="40">
          <stop offset="0" stopColor="#e7cd8a" />
          <stop offset="0.5" stopColor="#d9b35c" />
          <stop offset="1" stopColor="#b88a2b" />
        </linearGradient>
        <linearGradient id="nc-navy" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#122451" />
          <stop offset="1" stopColor="#0a1124" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#nc-navy)" />
      {/* fine gold inset border */}
      <rect x="3.75" y="3.75" width="40.5" height="40.5" rx="10" stroke="url(#nc-gold)" strokeOpacity="0.4" strokeWidth="1" />

      {/* C — open serif ring */}
      <path
        d="M32.5 16.2A11 11 0 1 0 32.5 31.8"
        stroke="url(#nc-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* N — drawn over the C with a navy halo to create the interlace */}
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* navy halo (knockout) */}
        <path d="M16 32V16M16 16L30 32M30 32V16" stroke={navy} strokeWidth="6.4" />
        {/* gold strokes */}
        <path d="M16 32V16M16 16L30 32M30 32V16" stroke="url(#nc-gold)" strokeWidth="3" />
      </g>
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
            Fomento Mercantil Ltda.
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
