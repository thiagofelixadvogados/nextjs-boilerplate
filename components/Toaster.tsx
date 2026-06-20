"use client";

import { useApp } from "@/lib/store";

export function Toaster() {
  const { toasts, dismissToast } = useApp();
  const styles: Record<string, string> = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };
  const icons: Record<string, string> = { success: "✓", error: "✕", info: "i" };
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-rise flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${styles[t.type]}`}
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/60 text-xs font-bold">
            {icons[t.type]}
          </span>
          <p className="flex-1 leading-snug">{t.message}</p>
          <button
            onClick={() => dismissToast(t.id)}
            className="text-current/60 hover:text-current"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
