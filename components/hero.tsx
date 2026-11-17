"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRef } from "react";
import { BookButton } from "./book-button";
import { OpenBadge } from "./open-badge";
import { Magnetic } from "./motion/magnetic";
import { EASE } from "@/lib/motion";
import { site } from "@/lib/site";

const lines = ["West African heat,", "Hungarian comfort"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax: the film drifts slower than the page and pushes in slightly.
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.2]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <motion.div style={{ y: videoY, scale: videoScale }} className="absolute inset-0 -z-20 will-change-transform">
        <motion.div
          className="size-full"
          initial={{ scale: 1.35, filter: "brightness(0.4)" }}
          animate={{ scale: 1, filter: "brightness(1)" }}
          transition={{ duration: 2.2, ease: EASE, delay: 0.5 }}
        >
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
      </motion.div>
      {/* Flat scrims for legibility, no gradients. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-char/50" />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="mx-auto w-full max-w-[1440px] px-4 pb-32 pt-40 md:px-12 md:pb-16"
      >
        <h1 id="hero-title" className="display-1 max-w-[16ch] text-bone">
          {lines.map((line, i) => (
            <span key={line} className="block origin-bottom-left overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "110%", rotate: 3 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.95 + i * 0.14 }}
              >
                {i === 1 ? <span className="text-ember">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.35 }}
          className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[minmax(0,680px)_1fr] md:items-end"
        >
          <div>
            <p className="body-lead max-w-[44ch] text-bone-2">
              An upscale, moody bistro in Budapest&rsquo;s seventh district. Suya spice, Hungarian duck and a
              whiskey pour worth crossing town for, served late from Wednesday to Sunday.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <BookButton size="lg" />
              </Magnetic>
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

      {/* Opening curtain: burnt orange panel with the monogram lifts away on load. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] grid place-items-center bg-ember"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.55 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Image src="/images/monogram.png" alt="" width={177} height={140} className="h-20 w-auto brightness-0" priority />
        </motion.div>
      </motion.div>

      <motion.a
        href="#menu"
        aria-label="Scroll to the menu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-bone/20 md:block"
      >
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-ember"
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
        />
      </motion.a>
    </section>
  );
}
