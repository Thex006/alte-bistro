"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type MotionValueNum = MotionValue<number>;
import { SplitReveal } from "./motion/split-reveal";
import { RevealImage } from "./motion/reveal-image";
import Image from "next/image";
import { useRef } from "react";
import { chapters } from "@/lib/site";

/**
 * The page's photo moment: one night at Alte Bistro, 18:00 to 01:00.
 * Desktop pins the section and scrolls the photographs sideways.
 * Phones get a vertical stack with wipe reveals.
 */
export function NightChapters() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = chapters.length;
  // The track is n panels wide; travel (n - 1) of them so the last one lands in view.
  const x = useTransform(scrollYProgress, [0.04, 0.96], ["0%", `-${((n - 1) / n) * 100}%`]);
  const bar = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);

  return (
    <section
      ref={ref}
      id="night"
      aria-labelledby="night-title"
      className="relative bg-char md:h-[var(--track-h)]"
      style={{ ["--track-h" as string]: `${n * 90}vh` }}
    >
      {/* Desktop pinned track */}
      <div className="sticky top-0 hidden h-screen flex-col justify-center overflow-hidden md:flex">
        <div className="mx-auto mb-8 flex w-full max-w-[1440px] items-end justify-between gap-8 px-12">
          <SplitReveal id="night-title" text="One night on Kazinczy utca" accent={["night"]} className="heading-1 max-w-[16ch]" />
          <div className="mb-3 h-px w-48 bg-line" aria-hidden>
            <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-ember" />
          </div>
        </div>
        <motion.ol style={{ x }} className="flex w-max gap-6 pl-12 pr-12 will-change-transform">
          {chapters.map((c, i) => (
            <Panel key={c.time} c={c} i={i} n={n} progress={scrollYProgress} />
          ))}
        </motion.ol>
      </div>
      
      {/* Phone: vertical chapters */}
      <div className="px-4 py-24 md:hidden">
        <h2 className="heading-1 max-w-[16ch]" id="night-title-mobile">
          One night on Kazinczy utca
        </h2>
        <ol className="mt-12 flex flex-col gap-16">
          {chapters.map((c) => (
            <motion.li
              key={c.time}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <RevealImage src={c.image} alt={c.alt} sizes="100vw" className="aspect-[16/10]" />
              <p className="font-display tabular mt-6 text-5xl leading-none text-ember">{c.time}</p>
              <h3 className="heading-4 mt-4">{c.title}</h3>
              <p className="body-3 mt-2 text-bone-2">{c.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type Chapter = (typeof chapters)[number];

function Panel({ c, i, n, progress }: { c: Chapter; i: number; n: number; progress: MotionValueNum }) {
  // Each panel's photo drifts and settles as it travels through the viewport.
  const centre = (i / (n - 1)) * 0.92 + 0.04;
  // Offsets stay inside 0..1: scroll-linked transforms run on the compositor and reject anything else.
  const lo = Math.max(0, centre - 0.25);
  const hi = Math.min(1, centre + 0.25);
  const imgX = useTransform(progress, [lo, hi], ["-12%", "12%"]);
  const scale = useTransform(progress, centre <= lo ? [lo, hi] : centre >= hi ? [lo, hi] : [lo, centre, hi], centre <= lo ? [1, 0.86] : centre >= hi ? [0.86, 1] : [0.86, 1, 0.86]);
  const opacity = useTransform(progress, centre <= lo ? [lo, hi] : centre >= hi ? [lo, hi] : [lo, centre, hi], centre <= lo ? [1, 0.4] : centre >= hi ? [0.4, 1] : [0.4, 1, 0.4]);
  return (
    <motion.li style={{ scale, opacity }} className="w-[72vw] max-w-none shrink-0 origin-bottom-left">
      <figure className="grid grid-cols-[1fr_minmax(240px,320px)] items-end gap-8">
        <div className="relative aspect-[16/9] overflow-hidden">
          <motion.div style={{ x: imgX }} className="absolute inset-y-0 -left-[14%] -right-[14%]">
            <Image src={c.image} alt={c.alt} fill sizes="60vw" className="object-cover" />
          </motion.div>
        </div>
        <figcaption className="pb-2">
          <p className="font-display tabular text-7xl leading-none text-ember">{c.time}</p>
          <h3 className="heading-4 mt-6">{c.title}</h3>
          <p className="body-3 mt-3 text-bone-2">{c.body}</p>
        </figcaption>
      </figure>
    </motion.li>
  );
}
