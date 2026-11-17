"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { BookButton } from "./book-button";
import { EASE, VIEWPORT, reveal } from "@/lib/motion";
import { formatHuf, morePlates, signatures } from "@/lib/site";

export function MenuSection() {
  const [active, setActive] = useState(signatures[0].id);
  const current = signatures.find((d) => d.id === active) ?? signatures[0];

  return (
    <section id="menu" aria-labelledby="menu-title" className="bg-coal px-4 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <motion.h2
              id="menu-title"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="heading-1 max-w-[14ch]"
            >
              Three plates to order first
            </motion.h2>
            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="body-lead mt-6 max-w-[46ch] text-bone-2"
            >
              The signatures. Grill smoke and suya spice, a Hungarian duck done properly, and the pour the
              regulars keep writing about.
            </motion.p>

            <motion.ol
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
              className="mt-12 border-y border-line"
              onMouseLeave={() => undefined}
            >
              {signatures.map((dish) => {
                const isActive = dish.id === active;
                return (
                  <motion.li key={dish.id} variants={reveal} className="border-b border-line last:border-b-0">
                    <article
                      tabIndex={0}
                      onMouseEnter={() => setActive(dish.id)}
                      onFocus={() => setActive(dish.id)}
                      aria-label={`${dish.name}, ${formatHuf(dish.price ?? 0)}`}
                      className="group relative grid cursor-default gap-4 py-8 outline-none md:py-10"
                    >
                      {/* Phone: each dish carries its own photo. Desktop uses the sticky panel. */}
                      <div className="relative aspect-[16/10] overflow-hidden lg:hidden">
                        <Image src={dish.image} alt={dish.alt} fill sizes="100vw" className="object-cover" />
                      </div>
                      <div className="flex items-baseline justify-between gap-6">
                        <h3
                          className={`heading-4 transition-colors duration-300 ease-out-expo md:text-4xl md:leading-10 ${
                            isActive ? "text-bone" : "text-bone-2 lg:text-bone-3"
                          } group-hover:text-bone`}
                        >
                          {dish.name}
                        </h3>
                        <p className="title-1 tabular shrink-0 text-ember">
                          {dish.price ? formatHuf(dish.price) : null}
                        </p>
                      </div>
                      <p className="body-3 max-w-[48ch] text-bone-2">{dish.note}</p>
                      <span
                        aria-hidden
                        className={`absolute bottom-[-1px] left-0 h-px w-full origin-left bg-ember transition-transform duration-500 ease-out-expo ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        } max-lg:hidden`}
                      />
                    </article>
                  </motion.li>
                );
              })}
            </motion.ol>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Image src={current.image} alt={current.alt} fill sizes="40vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="caption-2 text-bone-3">Prices in Hungarian forint</p>
                <BookButton size="sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 md:mt-32">
          <motion.h3
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="heading-4"
          >
            Also on the pass tonight
          </motion.h3>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="mt-8 grid gap-4 sm:grid-cols-3 md:gap-6"
          >
            {morePlates.map((p) => (
              <motion.li key={p.name} variants={reveal} className="group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                  />
                </div>
                <p className="title-3 mt-4">{p.name}</p>
              </motion.li>
            ))}
          </motion.ul>
          <p className="caption-2 mt-6 text-bone-3">Full menu and prices at the table.</p>
        </div>
      </div>
    </section>
  );
}
