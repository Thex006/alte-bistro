"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Piece = {
  src: string;
  /** Position inside the section, in CSS. */
  pos: React.CSSProperties;
  /** Width in px on desktop; phones get 55%. */
  w: number;
  /** 0 far away (small travel, soft) to 1 close (big travel, sharp). */
  depth: number;
  turn: number;
  phone?: boolean;
};

const PIECES: Piece[] = [
  { src: "/images/cut/duck-breast.webp", pos: { right: "-3%", top: "4%" }, w: 380, depth: 1, turn: 14, phone: true },
  { src: "/images/cut/suya-skewers.webp", pos: { left: "-6%", bottom: "-2%" }, w: 360, depth: 0.85, turn: -18, phone: true },
  { src: "/images/cut/smash-burger.webp", pos: { left: "62%", top: "46%" }, w: 200, depth: 0.55, turn: 10 },
  { src: "/images/cut/red-coupe.webp", pos: { left: "52%", top: "2%" }, w: 96, depth: 0.25, turn: -8 },
  { src: "/images/cut/plantain-pork-belly.webp", pos: { left: "36%", bottom: "4%" }, w: 150, depth: 0.35, turn: 16 },
  { src: "/images/cut/old-fashioned.webp", pos: { right: "30%", top: "30%" }, w: 82, depth: 0.2, turn: -12 },
];

/**
 * The client's own dishes, cut out and hung in the air at different depths.
 * Near pieces travel further and stay sharp; far pieces drift and soften. All
 * movement is transform only, so it runs on the compositor.
 */
export function FloatingFood({ progress }: { progress: MotionValue<number> }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {PIECES.map((p) => (
        <Float key={p.src} p={p} progress={progress} sx={sx} sy={sy} />
      ))}
    </div>
  );
}

function Float({
  p,
  progress,
  sx,
  sy,
}: {
  p: Piece;
  progress: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  // Phones scroll a long narrow column, so pieces travel less there.
  const [reach, setReach] = useState(260);
  useEffect(() => setReach(window.innerWidth < 768 ? 90 : 260), []);
  const travel = reach * p.depth;
  const scrollY = useTransform(progress, [0, 1], [travel, -travel]);
  const rotate = useTransform(progress, [0, 1], [-p.turn, p.turn]);
  const x = useTransform(sx, (v) => v * 40 * p.depth);
  const y = useTransform([scrollY, sy] as MotionValue<number>[], ([a, b]: number[]) => a + b * 30 * p.depth);
  const soft = p.depth < 0.4;

  return (
    <motion.div
      className={`absolute ${p.phone ? "w-[46vw] max-w-[var(--w)] md:w-[var(--w)]" : "hidden md:block md:w-[var(--w)]"}`}
      style={{ ...p.pos, x, y, rotate, ["--w" as string]: `${p.w}px`, zIndex: Math.round(p.depth * 10) }}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: soft ? 0.55 : 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={p.src}
        alt=""
        width={p.w * 2}
        height={p.w * 2}
        sizes={`(min-width: 768px) ${p.w}px, 55vw`}
        className={`h-auto w-full drop-shadow-[0_30px_30px_rgba(0,0,0,0.7)] ${soft ? "blur-[2px]" : ""}`}
      />
    </motion.div>
  );
}
