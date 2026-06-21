import Link from "next/link";
import { asset } from "@/lib/asset";

// Official New Capital monogram (gold NC badge). Works on light and dark backgrounds.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={asset("/nc-logo.png")}
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
  size = "md",
}: {
  light?: boolean;
  href?: string | null;
  compact?: boolean;
  size?: "md" | "lg";
}) {
  const mark = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const name = size === "lg" ? "text-xl" : "text-lg";
  const sub = size === "lg" ? "text-[11px]" : "text-[10px]";
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={`${mark} shrink-0`} />
      {!compact && (
        <span className="leading-none">
          <span
            className={`block font-serif ${name} font-semibold tracking-tight ${
              light ? "text-white" : "text-navy-900"
            }`}
          >
            NEW <span className="gold-text">CAPITAL</span>
          </span>
          <span
            className={`mt-0.5 block ${sub} font-medium uppercase tracking-[0.32em] ${
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
