"use client";

import { Marquee } from "./motion/marquee";

const FRONT = ["Suya spice", "Hungarian duck", "Whiskey poured late", "Wednesday to Sunday", "Kazinczy utca 14"] as const;
const BACK = ["West African heat", "Hungarian comfort", "Open until 01:00", "Budapest VII"] as const;

/** Two bands crossed in an X between the menu and the night: solid ember in front, outlined behind. */
export function EmberRibbon() {
  return (
    <div aria-hidden className="relative h-56 overflow-hidden bg-char md:h-80">
      <div className="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 rotate-[4deg]">
        <Marquee
          items={BACK}
          reverse
          baseSpeed={2}
          className="font-display border-y border-ember/40 bg-char py-3 text-2xl uppercase tracking-wide text-ember/60 md:py-4 md:text-4xl [&_[aria-hidden]]:bg-ember/60"
        />
      </div>
      <div className="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 -rotate-[4deg]">
        <Marquee
          items={FRONT}
          baseSpeed={3}
          className="font-display bg-ember py-3 text-2xl uppercase tracking-wide text-ink shadow-[0_24px_60px_rgba(0,0,0,0.6)] md:py-4 md:text-4xl"
        />
      </div>
    </div>
  );
}
