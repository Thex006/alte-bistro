"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { BookButton } from "./book-button";
import { RevealImage } from "./motion/reveal-image";
import { SplitReveal } from "./motion/split-reveal";
import { EASE, VIEWPORT, reveal } from "@/lib/motion";
import { formatHuf, morePlates, signatures } from "@/lib/site";

/**
 * Printed menu feel: bone paper, charcoal ink, burnt orange prices.
 * Desktop: hovering a dish floats its photo under the cursor.
 */
export function MenuSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 24, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 24, mass: 0.6 });
  const current = signatures.find((d) => d.id === hovered);

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-bone px-4 py-24 text-char md:px-12 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <SplitReveal id="menu-title" text="Three plates to order first" accent={["first"]} className="heading-1 md:col-span-7 md:text-8xl" />
          <motion.p
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="body-lead max-w-[40ch] text-char/70 md:col-span-5"
          >
            The signatures. Grill smoke and suya spice, a Hungarian duck done properly, and the pour the regulars
            keep writing about.
          </motion.p>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }}
          className="mt-16 border-t border-char/15 md:mt-24"
          onPointerMove={(e) => {
            x.set(e.clientX);
            y.set(e.clientY);
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {signatures.map((dish, i) => (
            <motion.li
              key={dish.id}
              variants={{
                hidden: { opacity: 0, y: 48 },
                show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
              }}
              className="border-b border-char/15"
            >
              <article
                tabIndex={0}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(dish.id)}
                onFocus={() => setHovered(dish.id)}
                onBlur={() => setHovered(null)}
                aria-label={`${dish.name}, ${formatHuf(dish.price ?? 0)}`}
                className="group relative grid cursor-default gap-4 py-8 outline-none md:grid-cols-[64px_1fr_auto] md:items-baseline md:gap-8 md:py-12"
              >
                <RevealImage
                  src={dish.image}
                  alt={dish.alt}
                  sizes="100vw"
                  className="aspect-[16/10] md:hidden"
                  parallax={4}
                />
                <span className="font-display tabular hidden text-2xl text-char/40 md:block">0{i + 1}</span>
                <div className="transition-transform duration-500 ease-out-expo md:group-hover:translate-x-4">
                  <h3 className="font-display text-3xl leading-tight md:text-6xl md:leading-none">{dish.name}</h3>
                  <p className="body-3 mt-3 max-w-[48ch] text-char/70 md:mt-4">{dish.note}</p>
                </div>
                <p className="font-display tabular text-3xl text-ember-lo md:text-5xl">
                  {dish.price ? formatHuf(dish.price) : null}
                </p>
                <span
                  aria-hidden
                  className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left scale-x-0 bg-ember transition-transform duration-700 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </article>
            </motion.li>
          ))}
        </motion.ol>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="caption-2 text-char/60">Prices in Hungarian forint. Full menu at the table.</p>
          <BookButton />
        </div>

        <div className="mt-24 md:mt-40">
          <SplitReveal as="h3" text="Also on the pass tonight" className="heading-2" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {morePlates.map((p, i) => (
              <li key={p.name} className={i === 1 ? "sm:mt-24" : ""}>
                <RevealImage
                  src={p.image}
                  alt={p.alt}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="aspect-[4/5]"
                  from={i === 0 ? "left" : i === 2 ? "right" : "bottom"}
                />
                <p className="title-1 mt-4">{p.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cursor photo preview, desktop mouse only. */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block"
      >
        <AnimatePresence>
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 4, transition: { duration: 0.25 } }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative -ml-[180px] -mt-[240px] h-[280px] w-[360px] overflow-hidden shadow-[0_24px_64px_rgb(0_0_0/0.35)]"
            >
              <Image src={current.image} alt="" fill sizes="360px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
