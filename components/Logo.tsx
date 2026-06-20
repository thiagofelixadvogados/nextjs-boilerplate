import Link from "next/link";

// Official New Capital monogram (gold NC badge). Works on light and dark backgrounds.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/nc-logo.png"
      alt="New Capital"
      width={48}
      height={48}
      className={`${className} rounded-full object-cover ring-1 ring-gold-400/30`}
    />
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
            NEW <span className="gold-text">CAPITAL</span>
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
