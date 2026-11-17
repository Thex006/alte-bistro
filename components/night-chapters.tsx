"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { chapters } from "@/lib/site";

/**
 * The page's photo moment: one night at Alte Bistro, 18:00 to 01:00.
 * Desktop pins the section and scrolls the photographs sideways.
 * Phones and reduced motion get a plain vertical stack.
 */
export function NightChapters() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
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
      className={`relative bg-char ${reduce ? "" : "md:h-[var(--track-h)]"}`}
      style={{ ["--track-h" as string]: `${n * 90}vh` }}
    >
      {/* Desktop pinned track */}
      <div className={`${reduce ? "hidden" : "hidden md:flex"} sticky top-0 h-screen flex-col justify-center overflow-hidden`}>
        <div className="mx-auto mb-8 flex w-full max-w-[1440px] items-end justify-between gap-8 px-12">
          <h2 id="night-title" className="heading-1 max-w-[16ch]">
            One night on Kazinczy utca
          </h2>
          <div className="mb-3 h-px w-48 bg-line" aria-hidden>
            <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-ember" />
          </div>
        </div>
        <motion.ol style={{ x }} className="flex w-max gap-6 pl-12 pr-12 will-change-transform">
          {chapters.map((c) => (
            <li key={c.time} className="w-[72vw] shrink-0 max-w-none">
              <figure className="grid grid-cols-[1fr_minmax(240px,320px)] items-end gap-8">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={c.image} alt={c.alt} fill sizes="55vw" className="object-cover" />
                </div>
                <figcaption className="pb-2">
                  <p className="font-display tabular text-6xl leading-none text-ember">{c.time}</p>
                  <h3 className="heading-4 mt-6">{c.title}</h3>
                  <p className="body-3 mt-3 text-bone-2">{c.body}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </motion.ol>
      </div>

      {/* Phone and reduced motion: vertical chapters */}
      <div className={`${reduce ? "block" : "md:hidden"} px-4 py-24 md:px-12`}>
        <h2 className="heading-1 max-w-[16ch]" id={reduce ? undefined : "night-title-mobile"}>
          One night on Kazinczy utca
        </h2>
        <ol className="mt-12 flex flex-col gap-16">
          {chapters.map((c) => (
            <motion.li
              key={c.time}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={c.image} alt={c.alt} fill sizes="100vw" className="object-cover" />
              </div>
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
