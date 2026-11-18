"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { BookButton } from "./book-button";
import { SplitReveal } from "./motion/split-reveal";
import { EASE } from "@/lib/motion";
import { formatHuf, morePlates, signatures, type Dish } from "@/lib/site";

/** How wide each cut out sits on the plate, as a share of the plate. */
const FIT: Record<string, { w: number; short: string }> = {
  suya: { w: 0.98, short: "Suya" },
  duck: { w: 0.94, short: "Duck" },
  jack: { w: 0.5, short: "Whiskey" },
};

const n = signatures.length;

/**
 * The signatures as a dish stage. On desktop the section pins and scrolling
 * turns the next plate onto the table; the rail and the labels follow. The
 * plate tilts in 3D under the cursor, with the food floating above it.
 */
export function MenuSection() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-coal">
      <DesktopStage />
      <PhoneStage />
      <PassRow />
    </section>
  );
}

function DesktopStage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.min(n - 1, Math.max(0, Math.floor(v * n)))));
  const rim = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rail = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dish = signatures[i];

  // Cursor tilt, eased with a spring so the plate feels heavy.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 120, damping: 18 });

  const go = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const target = top + travel * ((k + 0.5) / n);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: `${n * 110}vh` }}>
      <div
        className="sticky top-0 flex h-screen items-center overflow-hidden"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          mx.set((e.clientX / window.innerWidth) * 2 - 1);
          my.set((e.clientY / window.innerHeight) * 2 - 1);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        {/* Warm light pooled under the plate. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 size-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,98,42,0.16),transparent)]"
        />
        {/* Faint outlined name behind everything, the way a menu board ghosts through. */}
        <AnimatePresence mode="wait">
          <motion.p
            key={dish.id}
            aria-hidden
            className="marquee-outline font-display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[17vw] leading-none"
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 0.14, x: 0 }}
            exit={{ opacity: 0, x: -120 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {FIT[dish.id].short}
          </motion.p>
        </AnimatePresence>

        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-12 items-center gap-8 px-12">
          {/* Copy */}
          <div className="col-span-3 self-stretch py-28">
            <div className="flex h-full flex-col justify-between">
              <h2 id="menu-title" className="caption-2 uppercase tracking-[0.2em] text-ember">
                Three plates to order first
              </h2>
              <div className="relative min-h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dish.id}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
                      exit: { transition: { staggerChildren: 0.04 } },
                    }}
                  >
                    {[
                      <p key="i" className="font-display tabular text-xl text-bone-3">
                        0{i + 1} <span className="text-bone-3/60">/ 0{n}</span>
                      </p>,
                      <h3 key="n" className="font-display mt-5 text-5xl leading-[1.02] text-bone xl:text-6xl">
                        {dish.name}
                      </h3>,
                      <p key="d" className="body-3 mt-6 max-w-[32ch] text-bone-2">
                        {dish.note}
                      </p>,
                      <div key="p" className="mt-10 flex items-center gap-6">
                        <p className="font-display tabular text-3xl text-ember">{formatHuf(dish.price ?? 0)}</p>
                        <BookButton size="sm" />
                      </div>,
                    ].map((node, k) => (
                      <motion.div
                        key={k}
                        variants={{
                          hidden: { opacity: 0, y: 36 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                          exit: { opacity: 0, y: -24, transition: { duration: 0.3, ease: EASE } },
                        }}
                      >
                        {node}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="caption-2 text-bone-3">Prices in Hungarian forint. Full menu at the table.</p>
            </div>
          </div>

          {/* Plate */}
          <div className="col-span-6 flex justify-center" style={{ perspective: 1400 }}>
            <motion.div
              style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
              className="relative aspect-square w-[min(64vh,40vw)]"
            >
              <PlateDisc rim={rim} />
              <AnimatePresence initial={false}>
                <motion.div
                  key={dish.id}
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{ opacity: 0, rotate: -40, scale: 0.6, x: "45%" }}
                  animate={{ opacity: 1, rotate: 0, scale: 1, x: "0%" }}
                  exit={{ opacity: 0, rotate: 40, scale: 0.6, x: "-45%" }}
                  transition={{ duration: 0.95, ease: EASE }}
                >
                  <Food dish={dish} leaders />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Rail */}
          <div className="col-span-3 flex justify-end">
            <div className="flex gap-6">
              <div aria-hidden className="relative w-px bg-line">
                <motion.span style={{ scaleY: rail }} className="absolute inset-0 origin-top bg-ember" />
              </div>
              <ol className="flex flex-col gap-3">
                {signatures.map((d, k) => {
                  const on = k === i;
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => go(k)}
                        aria-current={on}
                        className={`group flex w-full items-center gap-4 rounded-full py-2 pl-2 pr-6 text-left transition-colors duration-500 ${
                          on ? "bg-ash" : "hover:bg-smoke"
                        }`}
                      >
                        <span
                          className={`relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-char ring-1 transition-[box-shadow] duration-500 ${
                            on ? "ring-ember" : "ring-line"
                          }`}
                        >
                          <Image src={d.cutout} alt="" width={64} height={64} className="size-12 object-contain" />
                        </span>
                        <span>
                          <span className={`block text-base transition-colors duration-500 ${on ? "text-bone" : "text-bone-3"}`}>
                            {d.name.replace(/[“”]/g, "")}
                          </span>
                          <span className="font-display tabular text-sm text-ember">{formatHuf(d.price ?? 0)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A dark stoneware plate with the house name turning round the rim. */
function PlateDisc({ rim }: { rim?: MotionValue<number> }) {
  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      <div
        aria-hidden
        className="absolute inset-0 rounded-full shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9),inset_0_2px_1px_rgba(255,255,255,0.07),inset_0_-12px_30px_rgba(0,0,0,0.6)]"
        style={{
          background:
            "radial-gradient(circle at 38% 30%, #34322c 0%, #22211d 45%, #151410 78%, #0d0c09 100%)",
        }}
      />
      <div aria-hidden className="absolute inset-[11%] rounded-full border border-white/[0.05] shadow-[inset_0_10px_30px_rgba(0,0,0,0.45)]" />
      <motion.svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute inset-0 size-full text-bone/15"
        style={rim ? { rotate: rim } : undefined}
      >
        <defs>
          <path id="rim" d="M100,100 m-93,0 a93,93 0 1,1 186,0 a93,93 0 1,1 -186,0" />
        </defs>
        <text className="fill-current" style={{ fontSize: 5.2, letterSpacing: 2.4 }}>
          <textPath href="#rim">
            ALTE BISTRO · KAZINCZY UTCA 14 · BUDAPEST VII · WEST AFRICAN HEAT · HUNGARIAN COMFORT ·
          </textPath>
        </text>
        <circle cx="100" cy="7" r="1.6" className="fill-[#e8622a]" />
      </motion.svg>
    </div>
  );
}

/** The cut out dish lifted off the plate, with labels drawn out to what the note names. */
function Food({ dish, leaders }: { dish: Dish; leaders?: boolean }) {
  const fit = FIT[dish.id];
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: `${fit.w * 100}%`,
        transform: "translate(-50%, -50%) translateZ(70px)",
        transformStyle: "preserve-3d",
      }}
    >
      <Image
        src={dish.cutout}
        alt={dish.alt}
        width={1400}
        height={1000}
        quality={90}
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="h-auto w-full drop-shadow-[0_28px_24px_rgba(0,0,0,0.65)]"
      />
      {leaders &&
        dish.labels.map((l, k) => {
          const right = l.x >= 50;
          // Run the line out past the plate edge so the label sits on the table.
          const reach = right ? `calc(${100 - l.x}% + ${fit.w < 0.7 ? 9 : 4}rem)` : `calc(${l.x}% + ${fit.w < 0.7 ? 9 : 4}rem)`;
          return (
            <div
              key={l.text}
              className="pointer-events-none absolute"
              style={{
                top: `${l.y}%`,
                left: right ? `${l.x}%` : undefined,
                right: right ? undefined : `${100 - l.x}%`,
                width: reach,
                transform: "translateZ(30px)",
              }}
            >
              <motion.span
                className={`absolute top-0 size-2.5 -translate-y-1/2 rounded-full bg-ember ring-4 ring-ember/25 ${right ? "-left-[5px]" : "-right-[5px]"}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.7 + k * 0.14 }}
              />
              <motion.span
                className={`absolute top-0 h-px w-full bg-bone/40 ${right ? "origin-left" : "origin-right"}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.8 + k * 0.14 }}
              />
              <motion.span
                className={`caption-2 absolute top-0 -translate-y-[calc(100%+6px)] whitespace-nowrap rounded-full bg-coal/85 px-2.5 py-1 text-bone backdrop-blur-sm ${right ? "-right-2.5 text-right" : "-left-2.5"}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 1 + k * 0.14 }}
              >
                <span className="mr-2 text-ember">0{k + 1}</span>
                {l.text}
              </motion.span>
            </div>
          );
        })}
    </div>
  );
}

/** Phones and tablets: each signature turns onto its plate as it scrolls in. */
function PhoneStage() {
  return (
    <div className="overflow-x-clip px-4 pb-8 pt-24 md:px-12 lg:hidden">
      <SplitReveal text="Three plates to order first" accent={["first"]} className="heading-1 max-w-[14ch]" />
      <ol className="mt-16 flex flex-col gap-24">
        {signatures.map((d, k) => (
          <PhoneDish key={d.id} dish={d} k={k} />
        ))}
      </ol>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
        <p className="caption-2 text-bone-3">Prices in Hungarian forint. Full menu at the table.</p>
        <BookButton />
      </div>
    </div>
  );
}

function PhoneDish({ dish, k }: { dish: Dish; k: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <li ref={ref}>
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <div
          aria-hidden
          className="absolute -inset-[15%] rounded-full bg-[radial-gradient(closest-side,rgba(232,98,42,0.18),transparent)]"
        />
        <PlateDisc />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
          animate={inView ? { opacity: 1, rotate: 0, scale: 1 } : undefined}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <Food dish={dish} />
        </motion.div>
      </div>
      <p className="font-display tabular mt-10 text-xl text-bone-3">0{k + 1}</p>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="font-display text-4xl leading-tight text-bone">{dish.name}</h3>
        <p className="font-display tabular text-2xl text-ember">{formatHuf(dish.price ?? 0)}</p>
      </div>
      <p className="body-3 mt-3 text-bone-2">{dish.note}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {dish.labels.map((l) => (
          <li key={l.text} className="caption-2 rounded-full border border-line px-3 py-1.5 text-bone-2">
            {l.text}
          </li>
        ))}
      </ul>
    </li>
  );
}

/** Also on the pass: each plate floats over a warm ring of light, like a dish under the heat lamp. */
function PassRow() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-16 md:px-12 md:pb-40 lg:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SplitReveal as="h3" text="Also on the pass tonight" accent={["tonight"]} className="heading-2" />
        <p className="caption-2 text-bone-3">Full menu and prices at the table.</p>
      </div>
      <ul className="mt-16 grid gap-20 sm:grid-cols-3 sm:gap-8">
        {morePlates.map((p, i) => (
          <li key={p.name} className="group flex flex-col items-center text-center">
            <div className="relative flex h-[300px] w-full items-end justify-center md:h-[380px]">
              <div
                aria-hidden
                className="absolute bottom-2 left-1/2 h-12 w-[72%] -translate-x-1/2 rounded-[50%] border border-ember/70 bg-[radial-gradient(closest-side,rgba(232,98,42,0.45),rgba(232,98,42,0.08)_60%,transparent)] shadow-[0_0_60px_rgba(232,98,42,0.35)] transition-[box-shadow] duration-700 group-hover:shadow-[0_0_90px_rgba(232,98,42,0.55)]"
              />
              <div aria-hidden className="absolute -bottom-3 left-1/2 h-14 w-[84%] -translate-x-1/2 rounded-[50%] border border-ember/25" />
              <motion.div
                className="relative mb-9 h-[82%] w-[78%]"
                initial={{ opacity: 0, y: 90, scale: 0.85 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 1.2, ease: EASE, delay: i * 0.12 }}
              >
                <motion.div
                  className="size-full"
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                >
                  <Image
                    src={p.cutout}
                    alt={p.alt}
                    fill
                    quality={90}
                    sizes="(min-width: 640px) 30vw, 80vw"
                    className="object-contain object-bottom drop-shadow-[0_30px_26px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-out-expo group-hover:-translate-y-3 group-hover:scale-105"
                  />
                </motion.div>
              </motion.div>
            </div>
            <p className="font-display mt-10 text-2xl">{p.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
