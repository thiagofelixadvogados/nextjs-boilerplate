"use client";

import { useState } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <section className="bg-navy-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="font-medium text-navy-900">{it.q}</span>
            <span
              className={`shrink-0 text-gold-600 transition-transform ${
                open === i ? "rotate-45" : ""
              }`}
            >
              ＋
            </span>
          </button>
          {open === i && (
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{it.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function Steps({
  steps,
}: {
  steps: { t: string; d: string }[];
}) {
  return (
    <ol className="relative space-y-8 border-l-2 border-dashed border-line pl-8">
      {steps.map((s, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[41px] grid h-8 w-8 place-items-center rounded-full bg-navy-900 text-sm font-bold text-gold-300 ring-4 ring-white">
            {i + 1}
          </span>
          <h3 className="font-semibold text-navy-900">{s.t}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}
