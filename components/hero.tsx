"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";
import { BookButton } from "./book-button";
import { OpenBadge } from "./open-badge";
import { EASE } from "@/lib/motion";
import { site } from "@/lib/site";

const lines = ["West African heat,", "Hungarian comfort"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax: the film drifts slower than the page and pushes in slightly.
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "30%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.06, reduce ? 1.06 : 1.16]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-18%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <motion.div style={{ y: videoY, scale: videoScale }} className="absolute inset-0 -z-20 will-change-transform">
        {/* Placeholder film cut from the client's chef plating photo. Swap hero.mp4/webm for the real kitchen footage. */}
        <video
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          aria-hidden
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>
      {/* Flat scrims for legibility, no gradients. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-char/55" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-char/35" />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="mx-auto w-full max-w-[1440px] px-4 pb-32 pt-40 md:px-12 md:pb-16"
      >
        <h1 id="hero-title" className="display-1 max-w-[16ch] text-bone">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.12 }}
              >
                {i === 1 ? <span className="text-ember">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
          className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[minmax(0,680px)_1fr] md:items-end"
        >
          <div>
            <p className="body-lead max-w-[44ch] text-bone-2">
              An upscale, moody bistro in Budapest&rsquo;s seventh district. Suya spice, Hungarian duck and a
              whiskey pour worth crossing town for, served late from Wednesday to Sunday.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookButton size="lg" />
              <a
                href="#menu"
                className="button-md group inline-flex h-14 items-center rounded-full px-4 text-bone transition-colors duration-300 hover:text-ember-hi"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]">
                  See the menu
                </span>
              </a>
            </div>
          </div>

          <dl className="flex flex-col gap-3 md:items-end md:text-right">
            <div className="flex items-center gap-2 md:justify-end">
              <dt className="sr-only">Press</dt>
              <span className="flex gap-0.5 text-ember" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" strokeWidth={0} />
                ))}
              </span>
              <dd className="title-4 text-bone">Featured in {site.press}</dd>
            </div>
            <div className="caption-2 flex flex-col gap-1 text-bone-2 md:items-end">
              <dt className="sr-only">Opening status</dt>
              <dd>
                <OpenBadge />
              </dd>
              <dt className="sr-only">Address</dt>
              <dd>
                {site.address.street}, {site.address.city}
              </dd>
            </div>
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}
