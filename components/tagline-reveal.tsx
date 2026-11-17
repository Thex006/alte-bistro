"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const TAGLINE =
  "Born to bridge the gap between late night street food and fine dining";

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{" "}
    </motion.span>
  );
}

/** Mandatory tagline moment (landing-page-design B11): words light up one by one on scroll. */
export function TaglineReveal() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = TAGLINE.split(" ");

  return (
    <section aria-label="Our promise" className="bg-char px-4 py-24 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <p ref={ref} className="heading-1 max-w-[18ch] text-bone md:text-7xl">
          {reduce
            ? TAGLINE
            : words.map((w, i) => (
                <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
              ))}
        </p>
        <p className="body-lead mt-12 max-w-[40ch] text-bone-2 md:ml-auto md:mt-16">
          Bold West African spices meet premium Hungarian ingredients. One kitchen, open late, cooking
          for the city after dark.
        </p>
      </div>
    </section>
  );
}
