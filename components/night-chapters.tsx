"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Framed, type FrameShape } from "./motion/framed";
import { SplitReveal } from "./motion/split-reveal";
import { chapters } from "@/lib/site";

/**
 * Each hour of the night gets its own frame, so the sideways scroll reads like
 * a contact sheet laid out on a table, not a row of identical cards.
 */
const ART: { shape: FrameShape; aspect: string; radius: string; lift: string; captionTop: boolean }[] = [
  { shape: "portrait", aspect: "aspect-[4/5]", radius: "0px", lift: "md:-translate-y-6", captionTop: false },
  { shape: "arch", aspect: "aspect-[3/4]", radius: "9999px 9999px 0 0", lift: "md:translate-y-10", captionTop: true },
  { shape: "wide", aspect: "aspect-[16/10]", radius: "0px", lift: "md:-translate-y-2", captionTop: false },
  { shape: "pill", aspect: "aspect-[3/5]", radius: "9999px", lift: "md:translate-y-6", captionTop: true },
  { shape: "arch", aspect: "aspect-[3/4]", radius: "9999px 9999px 0 0", lift: "md:-translate-y-4", captionTop: false },
];

export function NightChapters() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [travel, setTravel] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = chapters.length;

  // Measure the real track so the last frame lands exactly at the right edge.
  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (t) setTravel(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -travel]);
  const bar = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

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
        <div className="mx-auto mb-10 flex w-full max-w-[1440px] items-end justify-between gap-8 px-12">
          <SplitReveal
            id="night-title"
            text="One night on Kazinczy utca"
            accent={["night"]}
            className="heading-1 max-w-[16ch]"
          />
          <div className="mb-3 flex items-center gap-4">
            <span className="font-display tabular text-bone-3">18:00</span>
            <div className="h-px w-40 bg-line" aria-hidden>
              <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-ember" />
            </div>
            <span className="font-display tabular text-bone-3">01:00</span>
          </div>
        </div>
        <motion.ol ref={trackRef} style={{ x }} className="flex w-max items-center gap-24 px-12 will-change-transform">
          {chapters.map((c, i) => (
            <Panel key={c.time} c={c} i={i} n={n} progress={scrollYProgress} />
          ))}
        </motion.ol>
      </div>

      {/* Phone: vertical chapters, each in its own frame */}
      <div className="px-4 py-24 md:hidden">
        <h2 className="heading-1 max-w-[16ch]" id="night-title-mobile">
          One night on <span className="text-ember">Kazinczy utca</span>
        </h2>
        <ol className="mt-16 flex flex-col gap-24">
          {chapters.map((c, i) => (
            <li key={c.time} className={i % 2 ? "pl-12" : "pr-12"}>
              <Framed
                src={c.image}
                alt={c.alt}
                sizes="85vw"
                shape={ART[i].shape === "wide" ? "portrait" : ART[i].shape}
                outline={i % 2 ? "left" : "right"}
              />
              <p className="font-display tabular mt-10 text-5xl leading-none text-ember">{c.time}</p>
              <h3 className="heading-4 mt-4">{c.title}</h3>
              <p className="body-3 mt-2 text-bone-2">{c.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type Chapter = (typeof chapters)[number];

function Panel({ c, i, n, progress }: { c: Chapter; i: number; n: number; progress: MotionValue<number> }) {
  const art = ART[i % ART.length];
  // Where this panel sits in the scroll. Ranges stay inside 0..1: scroll-linked
  // transforms run on the compositor and reject anything outside it.
  const centre = 0.05 + (i / (n - 1)) * 0.9;
  const lo = Math.max(0, centre - 0.28);
  const hi = Math.min(1, centre + 0.28);
  const imgX = useTransform(progress, [lo, hi], ["-8%", "8%"]);
  const pts = [lo, centre, hi].filter((v, k, a) => k === 0 || v > a[k - 1]);
  const dim = pts.length === 3 ? [0.45, 1, 0.45] : centre <= lo ? [1, 0.45] : [0.45, 1];
  const opacity = useTransform(progress, pts, dim);

  return (
    <motion.li style={{ opacity }} className={`flex shrink-0 items-end gap-10 ${art.lift}`}>
      <div className={`relative h-[58vh] ${art.aspect}`}>
        <div
          aria-hidden
          className={`absolute inset-0 border border-ember/60 ${i % 2 ? "-translate-x-4 translate-y-4" : "translate-x-4 translate-y-4"}`}
          style={{ borderRadius: art.radius }}
        />
        <div className="absolute inset-0 overflow-hidden bg-smoke" style={{ borderRadius: art.radius }}>
          <motion.div style={{ x: imgX }} className="absolute inset-y-0 -left-[10%] -right-[10%] will-change-transform">
            <Image src={c.image} alt={c.alt} fill sizes="45vw" className="object-cover" />
          </motion.div>
        </div>
      </div>
      <div className={`w-[280px] ${art.captionTop ? "self-start pt-6" : "pb-2"}`}>
        <p className="font-display tabular text-7xl leading-none text-ember">{c.time}</p>
        <h3 className="heading-4 mt-6">{c.title}</h3>
        <p className="body-3 mt-3 text-bone-2">{c.body}</p>
      </div>
    </motion.li>
  );
}
