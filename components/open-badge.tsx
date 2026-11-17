"use client";

import { useEffect, useState } from "react";
import { budapestClock, openStatus, type OpenStatus } from "@/lib/open-status";

/** Live "open now" line in Budapest time. Rendered after mount so server and client agree. */
export function OpenBadge({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => {
      const { day, minutes } = budapestClock(new Date());
      setStatus(openStatus(day, minutes));
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-live="polite">
      <span
        aria-hidden
        className={`size-2 rounded-full ${
          status?.kind === "open" ? "bg-ember" : status ? "bg-bone-3" : "bg-ash"
        }`}
      />
      {status ? (
        <span>{compact ? status.short : status.label}</span>
      ) : (
        <span className="inline-block h-4 w-36 animate-pulse rounded bg-ash" aria-label="Loading opening status" />
      )}
    </span>
  );
}
