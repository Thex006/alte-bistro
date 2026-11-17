"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BookButton } from "./book-button";
import { Framed } from "./motion/framed";
import { SplitReveal } from "./motion/split-reveal";
import { EASE, VIEWPORT, reveal } from "@/lib/motion";
import { formatHuf, morePlates, signatures } from "@/lib/site";

const ARCH = "9999px 9999px 0px 0px";

/**
 * Dark menu card. Desktop: a tall arch (the cellar's vault shape) sits beside
 * the list and opens onto whichever dish you hover, focus or scroll past.
 */
export function MenuSection() {
  const [active, setActive] = useState(signatures[0].id);
  const current = signatures.find((d) => d.id === active) ?? signatures[0];
  const listRef = useRef<HTMLOListElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const archIn = useInView(archRef, { once: true, margin: "0px 0px -8% 0px" });

  // Scrolling also changes the dish: the row crossing the middle of the screen wins.
  useEffect(() => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-dish]");
    if (!rows) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.getAttribute("data-dish")!);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-coal px-4 py-24 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <SplitReveal
            id="menu-title"
            text="Three plates to order first"
            accent={["first"]}
            className="heading-1 md:col-span-7 md:text-8xl"
          />
          <motion.p
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="body-lead max-w-[40ch] text-bone-2 md:col-span-5"
          >
            The signatures. Grill smoke and suya spice, a Hungarian duck done properly, and the pour the regulars
            keep writing about.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12">
          <motion.ol
            ref={listRef}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }}
            className="border-t border-line lg:col-span-7"
          >
            {signatures.map((dish, i) => {
              const isActive = dish.id === active;
              return (
                <motion.li
                  key={dish.id}
                  data-dish={dish.id}
                  variants={{
                    hidden: { opacity: 0, y: 48 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
                  }}
                  className="border-b border-line"
                >
                  <article
                    tabIndex={0}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(dish.id)}
                    onFocus={() => setActive(dish.id)}
                    aria-label={`${dish.name}, ${formatHuf(dish.price ?? 0)}`}
                    className="group relative grid cursor-default gap-6 py-10 outline-none md:grid-cols-[56px_1fr] md:gap-8 md:py-14"
                  >
                    <Framed
                      src={dish.image}
                      alt={dish.alt}
                      vw={{ desktop: 90, mobile: 92 }}
                      ratio={4 / 3}
                      className="mr-2 lg:hidden"
                    />
                    <span
                      className={`font-display tabular hidden text-2xl transition-colors duration-500 md:block ${
                        isActive ? "text-ember" : "text-bone-3"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                        <h3
                          className={`font-display text-3xl leading-tight transition-[color,transform] duration-500 ease-out-expo md:text-5xl md:leading-none lg:text-4xl xl:text-5xl lg:group-hover:translate-x-3 ${
                            isActive ? "text-bone" : "text-bone lg:text-bone-3"
                          }`}
                        >
                          {dish.name}
                        </h3>
                        <p className="font-display tabular text-2xl text-ember md:text-3xl">
                          {dish.price ? formatHuf(dish.price) : null}
                        </p>
                      </div>
                      <p className="body-3 mt-4 max-w-[48ch] text-bone-2">{dish.note}</p>
                    </div>
                    <span
                      aria-hidden
                      className={`absolute bottom-[-1px] left-0 hidden h-px w-full origin-left bg-ember transition-transform duration-700 ease-out-expo lg:block ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </article>
                </motion.li>
              );
            })}
          </motion.ol>

          {/* Desktop arch: each dish opens upward inside the vault shape. */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 mx-auto w-full max-w-[440px]">
              <div ref={archRef} className="relative">
              <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 rounded-t-full border border-ember/70" />
              {/* The unclipped wrapper drives the reveal: an element clipped to nothing never reports itself in view. */}
              <motion.div
                className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-smoke"
                initial={{ clipPath: `inset(100% 0% 0% 0% round ${ARCH})` }}
                animate={{ clipPath: `inset(${archIn ? 0 : 100}% 0% 0% 0% round ${ARCH})` }}
                transition={{ duration: 1.4, ease: EASE }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.id}
                    className="absolute inset-0"
                    initial={{ clipPath: `inset(100% 0% 0% 0% round ${ARCH})` }}
                    animate={{ clipPath: `inset(0% 0% 0% 0% round ${ARCH})` }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1.25 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.4, ease: EASE }}
                    >
                      {/* 3:4 arch over a 16:9 photo: request about 2.4x the frame width so the crop stays sharp. */}
                      <Image src={current.image} alt={current.alt} fill quality={90} sizes="1100px" className="object-cover" />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              </div>
              <div className="mt-10 flex items-center justify-between gap-4">
                <p className="caption-2 text-bone-3">Prices in Hungarian forint</p>
                <BookButton size="sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 lg:hidden">
          <p className="caption-2 text-bone-3">Prices in Hungarian forint. Full menu at the table.</p>
          <BookButton />
        </div>

        {/* Also on the pass: three different frames, stepped like plates down a counter. */}
        <div className="mt-32 md:mt-48">
          <SplitReveal as="h3" text="Also on the pass tonight" className="heading-2" />
          <ul className="mt-12 grid items-start gap-12 sm:grid-cols-12 sm:gap-6">
            {morePlates.map((p, i) => {
              // One arch among straight frames, so the shape stays special.
              const layout = [
                { shape: "rect" as const, ratio: 4 / 3, cls: "sm:col-span-5", vw: 38 },
                { shape: "arch" as const, ratio: 3 / 4, cls: "sm:col-span-3 sm:mt-24", vw: 23 },
                { shape: "rect" as const, ratio: 4 / 5, cls: "sm:col-span-3 sm:col-start-10 sm:mt-8", vw: 23 },
              ][i];
              return (
                <li key={p.name} className={layout.cls}>
                  <Framed
                    src={p.image}
                    alt={p.alt}
                    vw={{ desktop: layout.vw, mobile: 92 }}
                    ratio={layout.ratio}
                    shape={layout.shape}
                  />
                  <p className="font-display mt-8 text-2xl">{p.name}</p>
                </li>
              );
            })}
          </ul>
          <p className="caption-2 mt-12 text-bone-3">Full menu and prices at the table.</p>
        </div>
      </div>
    </section>
  );
}
