"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Endless text band. Scrolling the page speeds it up and flips its direction. */
export function Marquee({
  items,
  baseSpeed = 2.5,
  className = "",
}: {
  items: readonly string[];
  baseSpeed?: number;
  className?: string;
}) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const dir = useRef(1);
  const pos = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseSpeed * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    x.set(x.get() - move);
  });

  const row = items.map((t, i) => (
    <span key={i} className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12">
      <span>{t}</span>
      <span aria-hidden className="inline-block size-3 rotate-45 bg-current md:size-4" />
    </span>
  ));

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <motion.div style={{ x: pos }} className="flex w-max whitespace-nowrap will-change-transform">
        {row}
        {row}
      </motion.div>
    </div>
  );
}
