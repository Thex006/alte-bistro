"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Wipe direction of the reveal. */
  from?: "bottom" | "left" | "right";
  /** Inner parallax travel in percent while the frame crosses the screen. */
  parallax?: number;
};

const clips = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Photo that wipes open when it enters the screen, settles from a 1.25 zoom,
 * then drifts inside its frame as you scroll. Zooms 1.04 on hover.
 */
export function RevealImage({ src, alt, sizes, className = "", priority, from = "bottom", parallax = 7 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden bg-smoke ${className}`}
      initial={{ clipPath: clips[from] }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      <motion.div style={{ y }} className="absolute inset-[-10%]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.25 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
