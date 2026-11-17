"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

/**
 * Art-directed photo frames. The arch comes from the brick vaults in the
 * cellar dining room, so the site's frames are the restaurant's own shape.
 *
 * arch     tall door shaped arch
 * portrait 4:5 upright crop
 * wide     cinematic letterbox
 * pill     fully rounded capsule
 */
export type FrameShape = "arch" | "portrait" | "wide" | "pill" | "rect";

const shapeClass: Record<FrameShape, string> = {
  arch: "aspect-[3/4]",
  portrait: "aspect-[4/5]",
  wide: "aspect-[21/9]",
  pill: "aspect-[3/5]",
  rect: "",
};

// Corner radii used inside clip-path inset(... round ...). Huge values clamp to a semicircle.
const radius: Record<FrameShape, string> = {
  arch: "9999px 9999px 0px 0px",
  portrait: "0px 0px 0px 0px",
  wide: "0px 0px 0px 0px",
  pill: "9999px 9999px 9999px 9999px",
  rect: "0px 0px 0px 0px",
};

type Props = {
  src: string;
  alt: string;
  sizes: string;
  shape?: FrameShape;
  className?: string;
  /** Thin burnt orange line frame offset behind the photo, like a mount. */
  outline?: "left" | "right" | false;
  /** Inner drift in percent while the frame crosses the screen. */
  parallax?: number;
  priority?: boolean;
  /** Focal point for the crop, e.g. "50% 30%". */
  focus?: string;
};

export function Framed({
  src,
  alt,
  sizes,
  shape = "arch",
  className = "",
  outline = false,
  parallax = 6,
  priority,
  focus = "50% 50%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  const r = radius[shape];
  // The unclipped wrapper decides visibility, so the clipped photo never hides itself from the observer.
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });

  return (
    <div ref={ref} className={`relative ${shapeClass[shape]} ${className}`}>
      {outline && (
        <motion.div
          aria-hidden
          className={`absolute inset-0 border border-ember/70 ${outline === "left" ? "-translate-x-3 translate-y-3 md:-translate-x-5 md:translate-y-5" : "translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5"}`}
          style={{ borderRadius: shape === "arch" ? "9999px 9999px 0 0" : shape === "pill" ? "9999px" : 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
        />
      )}
      <motion.div
        className="group absolute inset-0 overflow-hidden bg-smoke"
        style={{ borderRadius: shape === "arch" ? "9999px 9999px 0 0" : shape === "pill" ? "9999px" : 0 }}
        initial={{ clipPath: `inset(100% 0% 0% 0% round ${r})` }}
        animate={{ clipPath: `inset(${inView ? 0 : 100}% 0% 0% 0% round ${r})` }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.3 }}
            animate={{ scale: inView ? 1 : 1.3 }}
            transition={{ duration: 2, ease: EASE }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              style={{ objectPosition: focus }}
              className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.05]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
