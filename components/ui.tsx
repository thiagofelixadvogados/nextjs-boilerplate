"use client";

import React from "react";
import Link from "next/link";
import type { BadgeTone } from "@/lib/format";

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
type ButtonProps = {
  variant?: "primary" | "gold" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 disabled:opacity-50 disabled:cursor-not-allowed";

const btnVariants: Record<string, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800 shadow-sm",
  gold: "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 hover:from-gold-400 hover:to-gold-300 shadow-sm",
  outline: "border border-navy-900/20 text-navy-900 hover:bg-navy-900/5",
  ghost: "text-navy-900 hover:bg-navy-900/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const btnSizes: Record<string, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const cls = `${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white card-shadow ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "navy",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "navy" | "gold" | "green" | "red";
}) {
  const tones: Record<string, string> = {
    navy: "text-navy-900",
    gold: "text-gold-600",
    green: "text-emerald-600",
    red: "text-red-600",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-bold ${tones[tone]}`}>{value}</p>
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        {icon && (
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900/5 text-navy-800">
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
const tones: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  info: "bg-blue-50 text-blue-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  gold: "bg-gold-300/30 text-gold-600",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Form fields
// ---------------------------------------------------------------------------
export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-navy-900">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-navy-600 focus:ring-2 focus:ring-navy-600/15 placeholder:text-muted/70";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...props }, ref) {
  return <input ref={ref} className={`${inputCls} ${className}`} {...props} />;
});

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const { className = "", ...rest } = props;
  return <textarea className={`${inputCls} ${className}`} {...rest} />;
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  const { className = "", children, ...rest } = props;
  return (
    <select className={`${inputCls} ${className}`} {...rest}>
      {children}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/50 p-4 backdrop-blur-sm sm:items-center">
      <div
        className={`w-full ${maxWidth} animate-rise rounded-2xl border border-line bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-serif text-lg font-semibold text-navy-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-navy-900/5"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section heading (public site)
// ---------------------------------------------------------------------------
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center,
  light,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-serif text-3xl font-semibold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Disclaimer / compliance note
// ---------------------------------------------------------------------------
export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs leading-relaxed text-amber-900">
      <span aria-hidden className="mt-0.5 text-amber-500">⚠</span>
      <p>{children}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table primitives
// ---------------------------------------------------------------------------
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white card-shadow">
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-3 text-ink ${className}`}>{children}</td>;
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900/5 text-xl text-navy-700">
        ◇
      </div>
      <p className="font-semibold text-navy-900">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </Card>
  );
}
