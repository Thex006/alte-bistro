"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

/**
 * Art-directed photo frame.
 *
 * shape "arch" borrows the brick vaults of the cellar dining room. Use it on a
 * few chosen photos only; everything else stays a straight edged "rect".
 *
 * Sharpness: the photos are 16:9. A tall crop shows only the middle of the
 * file, so the browser must download a wider file than the frame. `vw` is the
 * frame's on screen width; the image request is widened by the crop factor.
 */
type Props = {
  src: string;
  alt: string;
  /** Frame width as a share of the viewport on desktop and on phones. */
  vw: { desktop: number; mobile: number };
  /** Frame width over height, e.g. 4 / 5. */
  ratio: number;
  shape?: "arch" | "rect";
  className?: string;
  /** Thin burnt orange line set 8px down and right, the same everywhere. */
  outline?: boolean;
  parallax?: number;
  priority?: boolean;
  /** Focal point for the crop, e.g. "50% 30%". */
  focus?: string;
};

const SOURCE_RATIO = 16 / 9;
// Inner parallax travel plus the reveal settle need a little extra resolution.
const MOTION_HEADROOM = 1.2;

export function sizesFor(vw: { desktop: number; mobile: number }, ratio: number) {
  const crop = Math.max(1, SOURCE_RATIO / ratio) * MOTION_HEADROOM;
  return `(min-width: 768px) ${Math.round(vw.desktop * crop)}vw, ${Math.round(vw.mobile * crop)}vw`;
}

export function Framed({
  src,
  alt,
  vw,
  ratio,
  shape = "rect",
  className = "",
  outline = true,
  parallax = 5,
  priority,
  focus = "50% 50%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  // The unclipped wrapper decides visibility, so the clipped photo never hides itself from the observer.
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const r = shape === "arch" ? "9999px 9999px 0px 0px" : "0px";
  const rounded = shape === "arch" ? "rounded-t-full" : "";

  return (
    <div ref={ref} className={`relative ${className}`} style={{ aspectRatio: ratio }}>
      {outline && (
        <motion.div
          aria-hidden
          className={`absolute inset-0 translate-x-2 translate-y-2 border border-ember/70 ${rounded}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
        />
      )}
      <motion.div
        className={`group absolute inset-0 overflow-hidden bg-smoke ${rounded}`}
        initial={{ clipPath: `inset(100% 0% 0% 0% round ${r})` }}
        animate={{ clipPath: `inset(${inView ? 0 : 100}% 0% 0% 0% round ${r})` }}
        transition={{ duration: 1.3, ease: EASE }}
      >
        <motion.div style={{ y }} className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            animate={{ scale: inView ? 1 : 1.15 }}
            transition={{ duration: 1.8, ease: EASE }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              quality={90}
              sizes={sizesFor(vw, ratio)}
              priority={priority}
              style={{ objectPosition: focus }}
              className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
