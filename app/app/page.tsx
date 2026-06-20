"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/dashboard");
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center bg-paper text-muted">
      Carregando…
    </div>
  );
}
