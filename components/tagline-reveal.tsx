"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Marquee } from "./motion/marquee";

const TAGLINE = "Born to bridge the gap between late night street food and fine dining";

/** Words that light up in burnt orange: the two worlds the bistro bridges. */
const ACCENT = new Set(["street", "food", "fine", "dining"]);

const BAND = [
  "Truffle suya skewers",
  "Nyíregyháza duck breast",
  "Jack and cola",
  "Kazinczy utca 14",
  "Open until 01:00",
] as const;

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block whitespace-pre ${ACCENT.has(word) ? "text-ember" : ""}`}>
      {word}{" "}
    </motion.span>
  );
}

/**
 * Dark and quiet: the dish names run past in outlined type that reacts to scroll
 * speed, then the tagline lights up word by word (landing-page-design B11).
 */
export function TaglineReveal() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = TAGLINE.split(" ");

  return (
    <section aria-label="Our promise" className="bg-char text-bone">
      <Marquee
        items={BAND}
        className="marquee-outline font-display border-y border-line py-6 text-4xl leading-none md:py-8 md:text-7xl"
      />
      <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-12 md:py-40">
        <p ref={ref} className="heading-1 max-w-[18ch] md:text-8xl" aria-label={TAGLINE}>
          {words.map((w, i) => (
            <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
          ))}
        </p>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="body-lead mt-12 max-w-[40ch] text-bone-2 md:ml-auto md:mt-16"
        >
          Bold West African spices meet premium Hungarian ingredients. One kitchen, open late, cooking for
          the city after dark.
        </motion.p>
      </div>
    </section>
  );
}
